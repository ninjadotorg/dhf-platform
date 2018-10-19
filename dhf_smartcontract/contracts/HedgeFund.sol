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

library SafeMath {
    function mul(uint256 _a, uint256 _b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (_a == 0) {
            return 0;
        }

        uint256 c = _a * _b;
        require(c / _a == _b);

        return c;
    }

    function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
        require(_b > 0); // Solidity only automatically asserts when dividing by 0
        uint256 c = _a / _b;
        // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold

        return c;
    }

    function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
        require(_b <= _a);
        uint256 c = _a - _b;

        return c;
    }

    function add(uint256 _a, uint256 _b) internal pure returns (uint256) {
        uint256 c = _a + _b;
        require(c >= _a);

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}



library Percent {
    // Solidity automatically throws when dividing by 0
    struct percent {
        uint num;
        uint den;
    }
    function mul(percent storage p, uint a) internal view returns (uint) {
        if (a == 0) {
            return 0;
        }
        return a*p.num/p.den;
    }

    function div(percent storage p, uint a) internal view returns (uint) {
        return a/p.num*p.den;
    }

    function sub(percent storage p, uint a) internal view returns (uint) {
        uint b = mul(p, a);
        if (b >= a) return 0;
        return a - b;
    }

    function add(percent storage p, uint a) internal view returns (uint) {
        return a + mul(p, a);
    }
}


contract HedgeFund {
    using Percent for Percent.percent;
    using SafeMath for uint;

    //Parameters
    enum S { NULL, INITFUND, READY, RELEASED, STOP, WITHDRAW }
    

    struct CancelData { // userWithdrawFund = (userFund * scale)/denominator
        uint id;
        uint8 vote;
    }

    struct Project {
        address owner;
        uint target;
        uint max;
        uint fundingAmount;
        uint availableAmount;

        uint releasedAmount;
        uint retractAmount;

        mapping(bytes32 => uint) releasePeriod;
        
        uint startTime;

        uint deadline;
        uint lifeTime;
        
        mapping(address => uint) funds;
        address[] funder;
        mapping(address => CancelData) cancelRequests;
        address[] cancelRequestArr;

        S state;
        Percent.percent plScale;
        Percent.percent commission;
        uint commisionAmount;
    }

    address contractOwner;
    mapping(bytes32 => Project) public projects;
    bytes32[] PIDs;

    //event

    event __receive(address from,  uint amount);

    event __init(address owner,  bytes32 pid);
    event __funding(bytes32 pid, address funder,  uint amount);
    

    event __withdraw(bytes32 pid, address requester, uint fundAmount, uint withdrawAmount);
    event __release(bytes32 pid, address exchange, uint amount, bytes32 stage);
    event __retract(bytes32 pid, uint from, uint to, uint availableAmount);
    event __voteStop(address sender, bytes32 pid, uint stop);
    event __stop(address sender, bytes32 pid);
    event __verifyWithdraw(bytes32 pid);

    event __changeState(bytes32 pid, S from, S to);
    event __log(uint time1, uint time2);

    modifier onlyContractOwner() {
        require(contractOwner == msg.sender, "101");
        _;
    }

    modifier onlyProjectOwner(bytes32 pid) {
        require(msg.sender == projects[pid].owner || contractOwner == msg.sender, "101");
        _;
    }

    function isReachMax(uint max,uint  balance) public pure returns (bool r) {
        if (max > 0 && balance >= max) return true;
        else return false;
    }
    
    function isReachTime(uint time) public view returns (bool) {
        if (block.timestamp > time) return true; //Using timestamp in eth blockchain???
        else return false;
    }

    //Constructor
    constructor() public {
        contractOwner = msg.sender;
    }

    //POST function
    function initProject(uint target, uint max, uint deadline, uint lifeTime, uint8 commission, bytes32 pid) public {
        require(projects[pid].owner == 0, "PID Already created") ;

        Project memory p;
        
        p.owner = msg.sender;
        p.state = S.INITFUND;
        p.releasedAmount = 0;
        p.retractAmount = 0;
        p.commission = Percent.percent(commission,100);
        

        p.deadline = deadline;
        p.lifeTime = lifeTime * 1 days;

        p.max = max;
        p.target = target;

        p.fundingAmount = 0;
        p.availableAmount = 0;
        p.releasedAmount = 0;
        p.plScale = Percent.percent(1, 1);

        projects[pid] = p;
        PIDs.push(pid);
        emit __init(msg.sender, pid);
        emit __changeState(pid, S.NULL, p.state);
    }
    
    function stopProject(bytes32 pid) public onlyProjectOwner(pid) {
        Project storage p = projects[pid];
        if (p.state == S.WITHDRAW) revert ("Already stop");
        emit __stop(msg.sender, pid);
        if (p.state == S.INITFUND || p.state == S.READY){
            emit __changeState(pid, p.state, S.WITHDRAW);
            p.state = S.WITHDRAW;
        }else {
            emit __changeState(pid, p.state, S.STOP);
            p.state = S.STOP;
        }
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
            if (p.fundingAmount.add(msg.value) >= p.target) {
                emit __changeState(pid, p.state, S.READY);
                p.state = S.READY;
            }
        } 
        
        //update fund
        if ( msg.value > 0 ) {
            if (p.funds[msg.sender] > 0)
                p.funds[msg.sender] = p.funds[msg.sender].add(msg.value);
            else {
                p.funds[msg.sender] = msg.value;
                p.funder.push(msg.sender);
            }

            p.fundingAmount = p.fundingAmount.add(msg.value);

            //recheck the balance if fund is larger max
            if ( isReachMax(p.max, p.fundingAmount) ){
                if (p.fundingAmount.sub(p.max) > 0.1 ether) { 
                    uint returnAmount = p.fundingAmount.sub(p.max).sub(0.1 ether);
                    msg.sender.transfer(returnAmount);
                    p.funds[msg.sender] = p.funds[msg.sender].sub(returnAmount);
                    p.fundingAmount = p.fundingAmount.sub(returnAmount);
                }
            }
            p.availableAmount = p.fundingAmount;
            emit __funding(pid, msg.sender, msg.value);
        }
    }

    function withdrawFund(bytes32 pid) public {
        Project storage p = projects[pid];
        
        if (p.state == S.INITFUND && p.funds[msg.sender] > 0) {
            p.fundingAmount = p.fundingAmount.sub(p.funds[msg.sender]);
            p.availableAmount = p.fundingAmount;
            msg.sender.transfer(p.funds[msg.sender]);
            emit __withdraw(pid, msg.sender, p.funds[msg.sender], p.funds[msg.sender]);
            p.funds[msg.sender] = 0;
        }
        else if (p.state == S.WITHDRAW && (p.funds[msg.sender] > 0 || (msg.sender == p.owner && p.commisionAmount != 0) ) ) {
            uint256 withdrawAmount = Percent.mul(p.plScale, p.funds[msg.sender]);

            //if owner, add commssion
            if (msg.sender == p.owner) withdrawAmount = withdrawAmount + p.commisionAmount;
            emit __withdraw(pid, msg.sender, p.funds[msg.sender], withdrawAmount);
            p.availableAmount = p.availableAmount.sub(withdrawAmount);
            msg.sender.transfer(withdrawAmount);
            p.funds[msg.sender] = 0;
        } else {
            if (p.funds[msg.sender] == 0) revert("No money to withdraw");
            revert("Cannot withdraw");
        }
    } 

    function release(bytes32 pid, address exchange, uint amount, bytes32 stage) public onlyContractOwner() {
        Project storage p = projects[pid];
        require(p.state == S.READY || p.state == S.RELEASED, "100"); //should be in ready or release state
        require(p.releasedAmount + amount <= p.fundingAmount, "102"); //should not release fund larger than funding amount
        if (p.releasePeriod[stage]!=0) revert("Already transfer for this period");
        if (p.state == S.READY) p.startTime = block.timestamp; //release signal in ready state (means first release), update start time to now
        exchange.transfer(amount);
        
        p.releasedAmount = p.releasedAmount.add(amount);
        p.availableAmount = p.availableAmount.sub(amount);
        p.releasePeriod[stage] = amount;

        emit __changeState(pid, p.state, S.RELEASED);
        p.state = S.RELEASED;
        emit __release(pid, exchange, amount, stage);
    }

    function retract(bytes32 pid, uint retractAmount) public onlyContractOwner() { //0.017 => scale=17 
        Project storage p = projects[pid];
        require(p.state == S.STOP, "100");
        
        p.availableAmount = p.availableAmount.add(retractAmount);
        if (p.availableAmount > p.fundingAmount) {
            uint commissionAmount = Percent.mul(p.commission, p.availableAmount.sub(p.fundingAmount));
            p.plScale = Percent.percent(p.availableAmount - commissionAmount, p.fundingAmount);
            p.commisionAmount = commissionAmount;
        } else {
            p.plScale = Percent.percent(p.availableAmount, p.fundingAmount);
        }
        p.retractAmount = retractAmount;
        emit __changeState(pid, p.state, S.WITHDRAW);
        p.state = S.WITHDRAW;
        emit __retract(pid, p.plScale.num, p.plScale.den, p.availableAmount);
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
                sum = sum.add(p.funds[addr]);
            }
        }
        if (sum > (p.fundingAmount/2)) {
            if (p.state == S.READY ){
                emit __changeState(pid, p.state, S.WITHDRAW);
                p.state = S.WITHDRAW;
            } else {
                emit __changeState(pid, p.state, S.STOP);
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
                emit __changeState(pid, p.state, S.WITHDRAW);
                p.state = S.WITHDRAW;
            }
        } else if (p.state == S.READY){
            if (isReachTime(p.deadline + 7 days)) {
                emit __changeState(pid, p.state, S.WITHDRAW);
                p.state = S.WITHDRAW;
            }
        } else if (p.state == S.RELEASED){
            if (isReachTime(p.deadline + p.lifeTime)) {
                emit __changeState(pid, p.state, S.STOP);
                p.state = S.STOP;
            }
        } 
    }
    
    function () external payable{
        emit __receive(msg.sender, msg.value);
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

    function getProjectInfo(bytes32 pid) public view returns (address owner, uint target, uint max,uint fundingAmount, uint availableAmount, uint releasedAmount, uint retractAmount,
        uint startTime, uint deadline, uint lifeTime, S state, uint numFunder) {
        Project storage p = projects[pid];
        return (p.owner, p.target, p.max, p.fundingAmount, p.availableAmount, p.releasedAmount, p.retractAmount, p.startTime, p.deadline, p.lifeTime,p.state, p.funder.length);
    }

    function getFunders(bytes32 pid) public view returns (address[] memory){
        Project memory p = projects[pid];
        return p.funder;
    }

    function getNumberOfFunder(bytes32 pid) public view returns (uint){
        Project storage p = projects[pid];
        return p.funder.length;
    }

    function getFundAmount(bytes32 pid, address funder) public view returns (uint){
        Project storage p = projects[pid];
        return p.funds[funder];
    }

    function getWithdrawAmount(bytes32 pid, address funder) public view returns (uint){
        Project storage p = projects[pid];
        uint withdrawAmount = Percent.mul(p.plScale, p.funds[funder]);
        return withdrawAmount;
    }

}