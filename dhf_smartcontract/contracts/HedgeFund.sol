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
    enum S { INITFUND, APPROVED, READY, RELEASED, STOP, WITHDRAW }
    
    struct ScaleFund { // userWithdrawFund = (userFund * scale)/denominator
        uint scale;
        uint denominator;
    }

    struct Project {
        address owner;
        uint target;
        uint max;
        uint fundingAmount;
        uint updatedAmmount;

        uint releasedAmount;
        uint startTime;
        uint deadline;
        uint lifeTime;

        mapping(address => uint) funds;
        mapping(address => uint8) cancelRequests;
        S state;
        ScaleFund scale;
    }

    address contractOwner;
    Project[] public projects;
    
    //event
    event __init(address owner, uint pid, bytes32 offchain);
    event __funding(uint pid, address funder,  uint amount);
    event __withdraw(uint pid, address requester, uint fundAmount, uint withdrawAmount);
    event __release(uint pid, address exchange, uint amount);
    event __retract(uint pid, uint from, uint to);
    event __voteStop(address sender, uint pid, uint8 stop);
    event __stop(address sender, uint pid);
    event __changeState(uint pid, bytes32 from, bytes32 to);

    modifier onlyContractOwner() {
        require(contractOwner == msg.sender, "101");
        _;
    }

    modifier onlyProjectOwner(uint pid) {
        require(msg.sender == projects[pid].owner || contractOwner == msg.sender, "101");
        _;
    }

    //Constructor
    constructor () public {
        contractOwner = msg.sender;
    }

    //POST function
    function initProject(uint max, uint deadline, uint lifeTime, bytes32 offchain) public {
        Project memory p;
        
        p.owner = msg.sender;
        p.state = S.INITFUND;
        p.releasedAmount = 0;

        ScaleFund memory scaleF;
        scaleF.scale = 10;
        scaleF.denominator = 1;
        p.scale = scaleF;

        p.deadline = deadline;
        p.lifeTime = lifeTime;
        
        p.max = max;
        p.fundingAmount = 0;
        p.updatedAmmount = 0;
        p.releasedAmount = 0;

        projects.push(p);
        emit __init(msg.sender, projects.length - 1, offchain);
        emit __changeState(projects.length - 1, "NULL", "INITFUND");
    }
    
    function stopProject(uint pid) public onlyProjectOwner(pid) {
        Project storage p = projects[pid];
        emit __stop(msg.sender, pid);
        if (p.state == S.INITFUND || p.state == S.APPROVED || p.state == S.READY || p.state == S.WITHDRAW){
            emit __changeState(pid, "_", "STOP");
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
    
    function isReachDeadline(uint deadline) public view returns (bool) {
        if (deadline > 0 && now > deadline) return true; //Using timestamp in eth blockchain???
        else return false;
    }

    function isReachlifeTime(uint time) public view returns (bool) {
        if (now > time) return true; //Using timestamp in eth blockchain???
        else return false;
    }

    function fundProject(uint pid) public payable {
        Project storage p = projects[pid];
        require(p.state == S.INITFUND || p.state == S.APPROVED, "100");

        uint fundingAmount = msg.value;

        if (p.state == S.INITFUND){
            if (isReachDeadline(p.deadline)){
                p.state = S.WITHDRAW;
                msg.sender.transfer(msg.value);
                emit __changeState(pid, "INITFUND", "WITHDRAW");
                return;
            } else if (p.fundingAmount >= p.target) {
                p.state = S.APPROVED;
                emit __changeState(pid, "INITFUND", "APPROVED");
            }
        } 
        
        if (p.state == S.APPROVED ){ //funding is reach deadline - do nothing
            if (isReachDeadline(p.deadline)){
                p.state = S.READY;
                msg.sender.transfer(msg.value);
                p.updatedAmmount = p.fundingAmount;
                p.startTime = now;
                emit __changeState(pid, "APPROVED", "READY");
                return;
            } 
        } 
        
        //update fund
        if ( msg.value > 0 ) {
            if (p.funds[msg.sender] >= 0)
                p.funds[msg.sender] = p.funds[msg.sender] + msg.value;
            else
                p.funds[msg.sender] = msg.value;
            p.fundingAmount = p.fundingAmount + msg.value;

            //recheck the balance if fund is larger max
            if ( isReachMax(p.max, p.fundingAmount) ){
                p.state = S.READY;
                p.startTime = now;
                emit __changeState(pid, "APPROVED", "READY");
                if (p.fundingAmount - p.max > 10) { //TODO: check unit
                    uint retractAmount = p.fundingAmount - p.max - 10;
                    msg.sender.transfer(retractAmount);
                    p.funds[msg.sender] = p.funds[msg.sender] - retractAmount;
                    p.fundingAmount = p.fundingAmount - retractAmount;
                }
                p.updatedAmmount = p.fundingAmount;
            }
            emit __funding(pid, msg.sender, fundingAmount);
        }
    }

    function withdrawFund(uint pid) public {
        Project storage p = projects[pid];
        
        if (isReachlifeTime(p.lifeTime + p.startTime) ){ //if this project reach lifeTime
            if (p.state == S.APPROVED || p.state == S.READY){ //and the state is in APPROVE or READY, it should allow user to withdraw
                p.state = S.WITHDRAW;
                emit __changeState(pid, "APPROVED|READY", "WITHDRAW");
            }
        }
            
        if ( p.state == S.INITFUND && p.funds[msg.sender] > 0) {
            p.updatedAmmount = p.updatedAmmount - p.funds[msg.sender];
            p.funds[msg.sender] = 0;
            msg.sender.transfer(p.funds[msg.sender]);
            emit __withdraw(pid, msg.sender, p.funds[msg.sender], p.funds[msg.sender]);
        } else  if ( p.state == S.WITHDRAW && p.funds[msg.sender] > 0) {
            uint256 withdrawAmount = (p.funds[msg.sender]*p.scale.scale)/p.scale.denominator;
            p.updatedAmmount = p.updatedAmmount - withdrawAmount;
            p.funds[msg.sender] = 0;
            msg.sender.transfer(withdrawAmount);
            emit __withdraw(pid, msg.sender, p.funds[msg.sender], withdrawAmount);
        } else {
            revert("Cannot withdraw at this state");
        }
    } 

    function release(uint pid, address exchange, uint amount) public {
        Project storage p = projects[pid];
        require(p.state == S.APPROVED || p.state == S.READY || p.state == S.RELEASED, "100"); //should be in ready or release state
        require(p.releasedAmount + amount <= p.fundingAmount, "102"); //should not release fund larger than funding amount

        if (p.state == S.APPROVED) p.startTime = now; //release signal in approved state (means start project anyway), update start time to now

        exchange.transfer(amount);
        p.releasedAmount = p.releasedAmount + amount;
        p.state == S.RELEASED;
        emit __changeState(pid, "APPROVED|READY|RELEASE", "RELEASE");
        emit __release(pid, exchange, amount);
        
    }

    function retract(uint pid, uint scale, uint denominator) public onlyContractOwner() { //0.017 => scale=17 
        Project storage p = projects[pid];
        require(p.state == S.RELEASED || p.state == S.STOP, "100");
        p.state == S.WITHDRAW;
        ScaleFund memory scaleF;
        scaleF.scale = scale;
        scaleF.denominator = denominator;
        p.scale = scaleF;
        p.updatedAmmount = (p.fundingAmount*p.scale.scale)/p.scale.denominator;
        emit __changeState(pid, "RELEASE|STOP", "WITHDRAW");
        emit __retract(pid, scale, denominator);
    }

    function voteStop(uint pid, uint8 stop) public {
        Project storage p = projects[pid];
        require(p.state != S.INITFUND, "100"); // except in init state, user can vote to stop or continue project
        p.cancelRequests[msg.sender] = stop;
        emit __voteStop(msg.sender, pid, stop);
    }
    
    //GET function
    function getProjectSize() public view returns (uint size) {
        return projects.length;
    }

}