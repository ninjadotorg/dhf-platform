import $ from 'jquery'
import axios from './axios'
import { getStorage, setStorage } from './storage'

$(async function () {
  const token = await getStorage('token')
  if (token) {
    await renderProjects(token)
  }
})

$('#login').on('click', async function () {
  const username = $('#username').val()
  const password = $('#password').val()
  if (!username || !password) {
    alert('Username and password are required')
    return
  }

  let data
  let projects
  try {
    data = await login(username, password)
    const token = data.id

    await setStorage('token', token)
    await renderProjects(token)
  } catch (e) {
    alert(e.message)
  }
})

$(document).on('click', function (e) {
  const $ele = $(e.target)
  if (!$ele.hasClass('btn-trade')) {
    return
  }

  console.log($ele.attr('data-project'))
})

async function getProjects (token) {
  const resp = await axios({
    url: `/projects/list?access_token=${token}`,
    method: 'get'
  })
  if (resp.status !== 200) {
    console.log(resp)
    throw new Error("Something's wrong. Please try again later.")
  }
  return resp.data
}

async function login (username, password) {
  const resp = await axios({
    url: '/users/login',
    method: 'post',
    data: {
      username,
      password
    }
  })

  if (resp.status !== 200) {
    console.log(resp)
    throw new Error("Something's wrong. Please try again later.")
  }

  return resp.data
}

function buildProjectsHTML (projects) {
  if (!projects.length) {
    return '<tr><td colspan="3">You don\'t have any projects</td></tr>'
  }

  let html = ''
  projects.forEach((project, idx) => {
    html += '<tr>'
    html += `<td>${idx + 1}</td>`
    html += `<td>${project.name}</td>`
    html += `<td><input type="button" class="btn-trade" value="Trade" data-project="${
      project.id
    }" /></td>`
    html += '</tr>'
  })

  return html
}

async function renderProjects (token) {
  try {
    const projects = await getProjects(token)

    $('#form').hide()
    // render projects
    const html = buildProjectsHTML(projects)
    $('#projects').show()
    $('#data').html(html)
  } catch (e) {
    alert(e.message)
  }
}

async function trade (project) {
  try {
    const cookies = await getCookies(project)
    cookies.forEach(cookie => {
      chrome.cookies.set({
        url: cookie.url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        secure: true,
        httpOnly: true
      })
    })

    // open tab to trade
    chrome.tabs.create({ url: 'https://binance.com' })
  } catch (e) {
    alert(e.message)
  }
}

async function getCookies (project) {
  const resp = await axios.get(API_PATH)
  if (resp.status !== 200) {
    console.log(resp)
    throw new Error("Something's wrong. Please try again later.")
  }

  return resp.data.cookies
}
