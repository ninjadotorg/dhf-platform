/**
    Author: vvstdung89
    Version: 0.01
    Date: 22 August 2018

    TODO:
        Optional: Vote 50% -> stop project (centralize accounting -> smart contract accounting)
        Function to read data|debug
    CONSIDER:
        storage vs memory
        Test: with large number of ether & scale
    Note:
        Project timeout: in release state, centralized system need to retract before user can withdraw!!!
*/

pragma solidity ^0.4.2;

//100: State Error
//101: Unauthorization
//102: release wrong amount

contract HedgeFund {
    //Parameters
    enum S { INITFUND, READY, RELEASED, STOP, WITHDRAW }
    
    struct ScaleFund { // userWithdrawFund = (userFund * scale)/denominator
        uint scale;
        uint denominator;
    }

    struct CancelData { // userWithdrawFund = (userFund * scale)/denominator
        uint id;
        uint8 vote;
    }

    struct Project {
        address owner;
        uint target;
        uint max;
        uint fundingAmount;
        uint updatedAmount;

        uint releasedAmount;
        mapping(uint => uint) releasePeriod;
        
        uint startTime;

        uint deadline;
        uint lifeTime;
        
        mapping(address => uint) funds;
        address[] funder;
        mapping(address => CancelData) cancelRequests;
        address[] cancelRequestArr;

        S state;
        ScaleFund scale;
    }

    address contractOwner;
    mapping(bytes32 => Project) public projects;
    bytes32[] PIDs;

    //event
    event __init(address owner,  bytes32 pid);
    event __funding(bytes32 pid, address funder,  uint amount);

    event __withdraw(bytes32 pid, address requester, uint fundAmount, uint withdrawAmount);
    event __release(bytes32 pid, address exchange, uint amount, uint period);
    event __retract(bytes32 pid, uint from, uint to, uint updatedAmount);
    event __voteStop(address sender, bytes32 pid, uint stop);
    event __stop(address sender, bytes32 pid);
    event __verifyWithdraw(bytes32 pid);
    event __changeState(bytes32 pid, bytes32 from, bytes32 to);
    event __log(uint time1, uint time2);

    modifier onlyContractOwner() {
        require(contractOwner == msg.sender, "101");
        _;
    }

    modifier onlyProjectOwner(bytes32 pid) {
        require(msg.sender == projects[pid].owner || contractOwner == msg.sender, "101");
        _;
    }

    //Constructor
    constructor() public {
        contractOwner = msg.sender;
    }

    //POST function
    function initProject(uint target, uint max, uint deadline, uint lifeTime, bytes32 pid) public {
        Project memory p;
        
        p.owner = msg.sender;
        p.state = S.INITFUND;
        p.releasedAmount = 0;

        ScaleFund memory scaleF;
        scaleF.scale = 1;
        scaleF.denominator = 1;
        p.scale = scaleF;

        p.deadline = deadline;
        p.lifeTime = lifeTime * 1 days;
        
        p.max = max;
        p.target = target;
        p.fundingAmount = 0;
        p.updatedAmount = 0;
        p.releasedAmount = 0;


        projects[pid] = p;
        PIDs.push(pid);
        emit __init(msg.sender, pid);
        emit __changeState(pid, "NULL", "INITFUND");
    }
    
    function stopProject(bytes32 pid) public onlyProjectOwner(pid) {
        Project storage p = projects[pid];
        if (p.state == S.WITHDRAW) revert ("Already stop");
        emit __stop(msg.sender, pid);
        if (p.state == S.INITFUND || p.state == S.READY){
            emit __changeState(pid, "_", "WITHDRAW");
            p.state = S.WITHDRAW;
        }else {
            emit __changeState(pid, "RELEASE|STOP", "STOP");
            p.state = S.STOP;
        }
    }

    function isReachMax(uint max,uint  balance) public pure returns (bool r) {
        if (max > 0 && balance >= max) return true;
        else return false;
    }
    
    function isReachTime(uint time) public view returns (bool) {
        if (block.timestamp > time) return true; //Using timestamp in eth blockchain???
        else return false;
    }

    function fundProject(bytes32 pid) public payable {
        Project storage p = projects[pid];
        require(p.state == S.INITFUND || p.state == S.READY, "100");

        if (isReachTime(p.deadline)){
            return revert("Cannot fund at this time");
        } 

        if (p.max != 0 && isReachMax(p.max, p.fundingAmount)){
            return revert("Fund get max limit");
        }

        if (p.state == S.INITFUND){
            if (p.fundingAmount + msg.value >= p.target) {
                p.state = S.READY;
                emit __changeState(pid, "INITFUND", "READY");
            }
        } 
        
        //update fund
        if ( msg.value > 0 ) {
            if (p.funds[msg.sender] > 0)
                p.funds[msg.sender] = p.funds[msg.sender] + msg.value;
            else {
                p.funds[msg.sender] = msg.value;
                p.funder.push(msg.sender);
            }

            p.fundingAmount = p.fundingAmount + msg.value;

            //recheck the balance if fund is larger max
            if ( isReachMax(p.max, p.fundingAmount) ){
                if (p.fundingAmount - p.max > 0.1 ether) { 
                    uint retractAmount = p.fundingAmount - p.max - 0.1 ether;
                    msg.sender.transfer(retractAmount);
                    p.funds[msg.sender] = p.funds[msg.sender] - retractAmount;
                    p.fundingAmount = p.fundingAmount - retractAmount;
                }
            }
            p.updatedAmount = p.fundingAmount;
            emit __funding(pid, msg.sender, msg.value);
        }
    }

    function withdrawFund(bytes32 pid) public {
        Project storage p = projects[pid];
        
        if (p.state == S.INITFUND && p.funds[msg.sender] > 0) {
            p.fundingAmount = p.fundingAmount - p.funds[msg.sender];
            p.updatedAmount = p.fundingAmount;
            msg.sender.transfer(p.funds[msg.sender]);
            emit __withdraw(pid, msg.sender, p.funds[msg.sender], p.funds[msg.sender]);
            p.funds[msg.sender] = 0;
        }
        else if (p.state == S.WITHDRAW && p.funds[msg.sender] > 0) {
            uint withdrawAmount = (p.funds[msg.sender]*p.scale.scale)/p.scale.denominator;
            p.updatedAmount = p.updatedAmount - withdrawAmount;
            msg.sender.transfer(withdrawAmount);
            emit __withdraw(pid, msg.sender, p.funds[msg.sender], withdrawAmount);
            p.funds[msg.sender] = 0;
        } else {
            if (p.funds[msg.sender] == 0) revert("No money to withdraw");
            revert("Cannot withdraw");
        }
    } 

    function release(bytes32 pid, address exchange, uint amount, uint period) public {
        Project storage p = projects[pid];
        require(p.state == S.READY || p.state == S.RELEASED, "100"); //should be in ready or release state
        require(p.releasedAmount + amount <= p.fundingAmount, "102"); //should not release fund larger than funding amount
        if (p.releasePeriod[period]!=0) revert("Already transfer for this period");
        if (p.state == S.READY) p.startTime = block.timestamp; //release signal in ready state (means first release), update start time to now
        exchange.transfer(amount);
        p.releasedAmount = p.releasedAmount + amount;
        p.releasePeriod[period] = amount;
        p.state = S.RELEASED;
        emit __changeState(pid, "READY|RELEASE", "RELEASE");
        emit __release(pid, exchange, amount, period);
    }

    function retract(bytes32 pid, uint scale, uint denominator) public onlyContractOwner() { //0.017 => scale=17 
        Project storage p = projects[pid];

        require(p.state == S.STOP, "100");
        p.state = S.WITHDRAW;

        ScaleFund memory scaleF;
        scaleF.scale = scale;
        scaleF.denominator = denominator;
        p.scale = scaleF;
        p.updatedAmount = (p.fundingAmount*p.scale.scale)/p.scale.denominator;

        emit __changeState(pid, "STOP", "WITHDRAW");
        emit __retract(pid, scale, denominator, p.updatedAmount);
    }

    

    function voteStop(bytes32 pid, uint8 stop) public { //vote stop and check if larger than half of the fund
        Project storage p = projects[pid];
        require(p.state == S.READY || p.state == S.RELEASED , "100"); // except in init state, user can vote to stop or continue project

        if (p.cancelRequests[msg.sender].id!=0){
            p.cancelRequests[msg.sender].vote = stop;
        } else {
            uint id = p.cancelRequestArr.push(msg.sender);
            p.cancelRequests[msg.sender].id = id;
            p.cancelRequests[msg.sender].vote = stop;
        }
        
        uint sum = 0;
        for (uint i=0; i < p.cancelRequestArr.length; i++) {
            address addr = p.cancelRequestArr[i];
            if (p.cancelRequests[addr].vote == 1){
                sum = sum + p.funds[addr];
            }
        }
        if (sum > (p.fundingAmount/2)) {
            if (p.state == S.READY ){
                emit __changeState(pid, "READY", "WITHDRAW");
                p.state = S.WITHDRAW;
            } else {
                emit __changeState(pid, "RELEASED", "STOP");
                p.state = S.STOP;
            }
        }       
        emit __voteStop(msg.sender, pid, p.cancelRequests[msg.sender].id);
    }

    function validateState(bytes32 pid) public {
        // initfund but get deadline -> WITHDRAW
        // ready but not release within 7 days -> WITHDRAW
        // release but get lifetime -> STOP
        Project storage p = projects[pid];
        if (p.state == S.INITFUND){
            if (isReachTime(p.deadline)) {
                emit __changeState(pid, "INITFUND", "WITHDRAW");
                p.state = S.WITHDRAW;
            }
        } else if (p.state == S.READY){
            if (isReachTime(p.deadline + 7 days)) {
                emit __changeState(pid, "READY", "WITHDRAW");
                p.state = S.WITHDRAW;
            }
        } else if (p.state == S.RELEASED){
            if (isReachTime(p.deadline + p.lifeTime)) {
                emit __changeState(pid, "RELEASED", "STOP");
                p.state = S.STOP;
            }
        } 
    }
    
    //GET function
    function shouldValidateState(bytes32 pid) public view returns (bool r){
        Project storage p = projects[pid];
        if (p.state == S.INITFUND){
            if (isReachTime(p.deadline)) return true;
        } else if (p.state == S.READY){
            if (isReachTime(p.deadline + 7 days)) return true;
        } else if (p.state == S.RELEASED){
            if (isReachTime(p.deadline + p.lifeTime)) return true;
        } else {
            return false;
        }
    }

    function getProjectSize() public view returns (uint size) {
        return PIDs.length;
    }

    function getProjectInfo(bytes32 pid) public view returns (address owner, uint target, uint max,uint fundingAmount, uint updatedAmount, uint releasedAmount,
        uint startTime, uint deadline, uint lifeTime, S state) {
        Project storage p = projects[pid];
        return (p.owner, p.target, p.max, p.fundingAmount, p.updatedAmount, p.releasedAmount, p.startTime, p.deadline, p.lifeTime,p.state);
    }

    function getFunders(bytes32 pid) public view returns (address[]){
        Project storage p = projects[pid];
        return p.funder;
    }

    function getFundAmount(bytes32 pid, address funder) public view returns (uint){
        Project storage p = projects[pid];
        return p.funds[funder];
    }

    function getWithdrawAmount(bytes32 pid, address funder) public view returns (uint){
        Project storage p = projects[pid];
        uint withdrawAmount = (p.funds[funder]*p.scale.scale)/p.scale.denominator;
        return withdrawAmount;
    }

}