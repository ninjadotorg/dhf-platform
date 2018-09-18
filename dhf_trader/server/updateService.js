require("../configs/configuration")
const Promise = require('bluebird')
var Gateway = require('./Exchanges/gateway');
let OrderDB = require("../common/models/orders")
let ExchangeDB = require("../common/models/exchanges")

const GatewayList = {}
let isRunning = false
const interval = 1000 * 10 // 10 seconds

async function getGateway(project) {
    try {
        let gateway = GatewayList[project]
        if (!gateway) {
            gateway = new Gateway(null, null, project)
            await gateway.init()

            GatewayList[project] = gateway
        }

        if (!gateway.exchange) {
            throw new Error('Exchange name incorrect')
        }

        return gateway
    } catch (e) {
        console.log('could not get gateway for project', project, e)
        throw e
    }
}

async function getOrderDetail(gateway, { orderId, symbol }) {
    return await gateway.action('getOrder', { symbol, orderId })
}

async function updateOrder(orderId, status, fillQty) {
    return await OrderDB.updateOne({ exchangeOrderID: orderId }, { status, fillQty })
}

async function updateOrdersNotIn(orders, gateway, project) {
    const orderIds = []
    orders.forEach(o => orderIds.push(o.orderId))

    const ordersNotIn = await OrderDB.find({ status: { $nin: ['FILLED', 'CANCELED'] }, exchangeOrderID: { $nin: orderIds } })
    if (!ordersNotIn.length) {
        console.log('project', project, 'doesn\'t have any open orders')
        return
    }

    // orders get from DB
    await Promise.each(ordersNotIn, async (o) => {
        const detail = await getOrderDetail(gateway, { orderId: o.exchangeOrderID, symbol: o.symbol })
        await updateOrder(o.exchangeOrderID, detail.status, detail.executedQty)
    })
}

async function updateOpenOrders(openOrders, gateway) {
    // openOrders get directly from binance api
    await Promise.each(openOrders, o => updateOrder(o.orderId, o.status, o.executedQty))
}

async function getSymbols(project) {
    return new Promise((resolve, reject) => {
        OrderDB.aggregate([
            {
                $match: { project }
            },
            {
                $group: {
                    _id: "$symbol"
                }
            }
        ]).exec((err, results) => {
            if (err) {
                return reject(err)
            }

            const symbols = []
            results.forEach(r => symbols.push(r._id))
            resolve(symbols)
        })
    })
}

async function updateOrders(project) {
    try {
        const gateway = await getGateway(project)

        const symbols = await getSymbols(project)
        if (!symbols.length) {
            return
        }

        await Promise.each(symbols, async (symbol) => {
            console.log('finding open orders of project', project, 'with symbol', symbol)
            const openOrders = await gateway.action('openOrders', { symbol })
            console.log('found', openOrders.length, 'open orders of project', project, 'with symbol', symbol)
            if (!openOrders.length) {
                return
            }

            await updateOpenOrders(openOrders, gateway)
            await updateOrdersNotIn(openOrders, gateway, project)
        })
    } catch (e) {
        console.log(e)
    }
}

async function getProjects() {
    return await ExchangeDB.find({ isLock: true })
}

async function run() {
    if (isRunning) {
        console.log('previous job is still running, skipping...')
        return
    }

    isRunning = true
    try {
        const projects = await getProjects()
        if (!projects.length) {
            return
        }

        await Promise.each(projects, p => updateOrders(p.lock.project))
    } catch (e) {
        console.log(e)
    } finally {
        isRunning = false
    }
}

module.exports = function() {
    console.log('Running update service...')

    setInterval(function() {
        run()
    }, interval)
}
