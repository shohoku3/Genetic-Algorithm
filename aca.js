//任务集合
var tasks = [];
//任务数量
var taskNum = 100;

//节点
var nodes = [];
//节点数
var nodeNum = 10;

//任务长度范围
var taskLengthRange = [10, 100]
//节点处理速贷范围
var nodeSpeedRange = [10, 100]

//迭代次数
var iteratorNum = 100;

//蚂蚁数量
var antNum = 100;

//任务处理时间矩阵 (每个任务在不同节点上的处理时间)
var timeMatrix = []

//信息素矩阵 记录每条路径的信息素含量 初始全为0
var pheromoneMatrix = []

//最大信息素的下标矩阵
var maxPheromonMatrix = []

//在一次迭代中,随机分配的蚂蚁临界编号该临界点之前的蚂蚁采用最大信息素下标，而该临界点之后的蚂蚁采用随机分配
var criticalPointMatrix = [];

//结果 任务处理时间结果集 ([iteratornum][antindex])
var resultData = []

//衰减比例
var p = 0.5

//跃升比例
var q = 0.2

//参数校验
/*
 *@param _taskNum 任务数量
 *@param _nodeNum 节点数量
 *@param _iteratorNum 迭代次数
 *@param _antNum 蚂蚁数量
 */
function checkParam(_taskNum, _nodeNum, _iteratorNum, _antNum) {
    if (isNaN(_taskNum)) {
        alert("任务数量必须是数字！");
        return false;
    }
    if (isNaN(_nodeNum)) {
        alert("节点数量必须是数字！");
        return false;
    }
    if (isNaN(_iteratorNum)) {
        alert("迭代次数必须是数字！");
        return false;
    }
    if (isNaN(_antNum)) {
        alert("蚂蚁数量必须是数字！");
        return false;
    }

    taskNum = _taskNum;
    nodeNum = _nodeNum;
    iteratorNum = _iteratorNum;
    antNum = _antNum;

    return true;
}

//初始化 立即执行
/*
 *@param _taskNum 任务数量
 *@param _nodeNum 节点数量
 *@param _iteratorNum 迭代次数
 *@param _antNum 蚂蚁数量
*/
(function init(_taskNum,_nodeNum,_iteratorNum,_antNum){
	if(!checkParam(_taskNum,_nodeNum,_iteratorNum,_antNum))
	{
		return;
	}

	tasks=initRandomArray(_taskNum,taskLengthRange)

	nodes=initRandomArray(_nodeNum,nodeSpeedRange)

	aca();

	//draw(resultData)
})(100,10,100,1000)

//算法主函数 
function aca(){
	//初始化任务执行时间的矩阵
	initTimeMatrix(tasks,nodes,timeMatrix);

	//初始化信息素矩阵
	initPheromoneMatrix(taskNum, nodeNum);

	//迭代搜索
	acaSearch(iteratorNum,antNum)
}

//初始化信息素矩阵 0阵
//记录任务i分配给节点j的信息素浓度
/*
*@param taskNum 
*@param nodeNum
*/
function initPheromoneMatrix(taskNum,nodeNum)
{
	for(var i=0;i<taskNum;i++)
	{
		var pheromoneMatrix_i=[];
		for (var j=0;j<nodeNum;j++)
		{
			pheromoneMatrix_i.push(0)
		}
		pheromoneMatrix.push(pheromoneMatrix_i)
	}
}

//迭代搜索
function acaSearch(iteratorNum,antNum)
{
	for(iteratorIndex=0;iteratorIndex<iteratorNum;iteratorIndex++)
	{
		
	}
}