//任务集合 任务长度
var tasks = [];

var tasksNum = 100;
//节点集合 节点处理速度
var nodes = [];

var nodeNum = 10;

/** 任务长度取值范围 */
var taskLengthRange = [10, 100];
/** 节点处理速度取值范围 */
var nodeSpeendRange = [10, 100];

//任务处理时间矩阵
var timeMatrix = [];
//迭代次数
var iteratorNum = 100;
//染色体的数量 初始种群的数量  可行解的数量
var chromosomeNum = 10;

//适应度矩阵 （下标：染色体标号 值：染色体的适应度）
var adaptability = [];
/** 自然选择的概率矩阵(下标：染色体编号、值：该染色体被选择的概率) */
var selectionProbability = [];

//染色体复制的概率
var cp = 0.2
//交叉变异染色体数量
var crossoverMutationNum;

//结果
var resultData = [];

//范围随机
/*
 *获取指定范围的随机数
 *@param start起始
 *@param end 终止
 */
function random(start, end) {
    var length = end - start + 1
    return Math.floor(Math.random() * length + start)
}

//初始化随机数组
/*
 *@param length  数组长度
 *@param range 数组范围
 */
function initRandomArray(length, range) {
    var randomArray = [];
    for (var i = 0; i < length; i++) {
        randomArray.push(random(range[0], range[1]))
    }
    return randomArray
}

//初始化任务处理时间的矩阵
/*
 *@param tasks 任务列表
 *@param nodes 节点处理列表
 */
function initTimeMatrix(tasks, nodes, timeMatrix) {
    for (var i = 0; i < tasks.length; i++) {
        //计算任务i分配给所有节点时间
        var timeMatrix_i = [];
        for (var j = 0; j < nodes.length; j++) {
            timeMatrix_i.push(tasks[i] / nodes[j])
        }
        timeMatrix.push(timeMatrix_i)
    }
}

/**
初始化遗传算法
*@params _taskNum 任务数量
*@params _nodeNum 节点数量
*@params _iteratorNum 迭代次数
*@params _chromsomeNum 染色体数量
*@params _cp 复制比例
*/
(function initGA(_taskNum, _nodeNum, _iteratorNum, _chromsomeNum, _cp) {
    //参数检验
    if (!checkParam(_taskNum, _nodeNum, _iteratorNum, _chromsomeNum, _cp)) {
        return;
    }

    tasks = initRandomArray(_taskNum, taskLengthRange);

    nodes = initRandomArray(_nodeNum, nodeSpeendRange);
    //执行遗传算法
    ga()
    //渲染
    draw(resultData)
})(100, 10, 100, 10, 0.2);

//遗传算法main function 
function ga() {
    //初始化任务执行时间矩阵
    initTimeMatrix(tasks, nodes, timeMatrix);

    gaSearch(iteratorNum, chromosomeNum)
}

//参数检验
/**
 *@params _taskNum 任务数量
 *@params _nodeNum 节点数量
 *@params _iteratorNum 迭代次数
 *@params _chromsomeNum 染色体数量
 *@params _cp 复制比例
 */

function checkParam(_taskNum, _nodeNum, _iteratorNum, _chromsomeNum, _cp) {
    if (isNaN(_taskNum)) {
        alert('任务数量为数字')
        return false
    }
    if (isNaN(_nodeNum)) {
        alert('节点数量为数字')
        return false
    }
    if (isNaN(_iteratorNum)) {
        alert('迭代次数为数字')
        return false
    }
    if (isNaN(_chromsomeNum)) {
        alert('染色体数量为数字')
        return false
    }
    if (isNaN(_cp) || _cp < 0 || _cp > 1) {
        alert('复制比例有问题')
        return false
    } else {
        tasksNum = _taskNum
        nodeNum = _nodeNum
        iteratorNum = _iteratorNum
        chromosomeNum = _chromsomeNum
        cp = _cp
        crossoverMutationNum = chromosomeNum - chromosomeNum * _cp

        return true
    }
}

//迭代搜索
/*
 *@param iteratorNum 迭代次数
 *@param chromosomeNum 染色体数量
 */
function gaSearch(iteratorNum, chromosomeNum) {
    //初始化第一代染色体
    var chromosomeMatrix = createGeneration();

    //迭代繁衍
    for (var iterIndex = 1; iterIndex < iteratorNum; iterIndex++) {
        calAdaptability(chromosomeMatrix);

        calSelectionProbability(adaptability);
        //生成新一代的染色体
        chromosomeMatrix = createGeneration(chromosomeMatrix)
    }
}

//生成新一代染色体
/*
 *@param chromosomeMatrix 初代或上代染色体矩阵 
 *@return 任务处理时间 和 下一代染色体矩阵
 */
function createGeneration(chromosomeMatrix) {
    //第一代随机生成 不需要筛选
    if (chromosomeMatrix == null || chromosomeMatrix == undefined) {
        var newChromosomeMatrix = [];
        for (var chromosomeIndex = 0; chromosomeIndex < chromosomeNum; chromosomeIndex++) {
            //每个染色体是一个可行解 下标：任务 值：时间 染色体矩阵 多染色体构成
            var chromosomeMatrix_i = [];
            for (var taskIndex = 0; taskIndex < tasksNum; taskIndex++) {
                chromosomeMatrix_i.push(random(0, nodeNum - 1));
            }
            newChromosomeMatrix.push(chromosomeMatrix_i);
        }
        //计算当前染色体的任务处理时间
        calTime_oneIt(newChromosomeMatrix);
        return newChromosomeMatrix
    } else {
        //交叉生成
        var newChromosomeMatrix = cross(chromosomeMatrix)

        //变异
        newChromosomeMatrix = mutation(newChromosomeMatrix)

        //复制
        newChromosomeMatrix = copy(chromosomeMatrix, newChromosomeMatrix)

        //计算染色体的任务处理时间
        calTime_oneIt(newChromosomeMatrix);
        return newChromosomeMatrix
    }
}
//计算染色体的适应度 
/*
 *@param chromosomeMatrix 多条染色体构成的矩阵
 */
function calAdaptability(chromosomeMatrix) {
    adaptability = [] //标识每个染色体的适应度
    //计算每条染色体的执行任务总长
    for (var chromosomeIndex = 0; chromosomeIndex < chromosomeNum; chromosomeIndex++) {
        var maxLength = Number.MIN_VALUE
        for (var nodeIndex = 0; nodeIndex < nodeNum; nodeIndex++) {
            var sumLength = 0;
            for (var taskIndex = 0; taskIndex < tasksNum; taskIndex++) {
                if (chromosomeMatrix[chromosomeIndex][taskIndex] == nodeIndex) {
                    sumLength += timeMatrix[taskIndex][nodeIndex];
                }
            }
            if (sumLength > maxLength) {
                maxLength = sumLength
            }
        }
        //适应度=1/任务长度
        adaptability.push(1 / maxLength);
    }
}
//计算自然选择的概率
/*
 *@params adaptability
 */
function calSelectionProbability(adaptability) {
    selectionProbability = []

    //适应度[i]/适应度之和
    var sumAdaptability = 0;
    for (var i = 0; i < adaptability.length; i++) {
        sumAdaptability += adaptability[i]
    }

    //计算选择概率
    for (var i = 0; i < chromosomeNum; i++) {
        selectionProbability.push(adaptability[i] / sumAdaptability);
    }
}

//计算所有染色体的任务处理时间
/*
 *@params chromosomeMatrix
 */
function calTime_oneIt(chromosomeMatrix) {
    var timeArray_oneIt = [];
    for (var chromosomeIndex = 0; chromosomeIndex < chromosomeNum; chromosomeIndex++) {
        var maxLength = Number.MIN_VALUE;
        for (var nodeIndex = 0; nodeIndex < nodeNum; nodeIndex++) {
            var sumLength = 0;
            for (var taskIndex = 0; taskIndex < tasksNum; taskIndex++) {
                if (chromosomeMatrix[chromosomeIndex][taskIndex] == nodeIndex) {
                    sumLength += timeMatrix[taskIndex][nodeIndex]
                }
            }
            if (sumLength > maxLength) {
                maxLength = sumLength
            }
        }
        timeArray_oneIt.push(maxLength)
    }
    resultData.push(timeArray_oneIt)
}

//交叉
/*
 *  crossoverMutationNum 交叉生成染色体的数目         crossoverMutationNum = chromosomeNum - chromosomeNum * _cp
 *  @params chromosomeMatrix
 */
function cross(chromosomeMatrix) {
    var newChromosomeMatrix = [];
    for (var chromosomeIndex = 0; chromosomeIndex < crossoverMutationNum; chromosomeIndex++) {
        //采用轮盘赌方法选择父母染色体 从全部染色体中
        var chromosomeDaDa = chromosomeMatrix[RWS(selectionProbability)].slice(0) //从数组中切并返回元素
        var chromosomeMaMa = chromosomeMatrix[RWS(selectionProbability)].slice(0)

        //交叉
        var crossIndex = random(0, tasksNum - 1);
        chromosomeDaDa.splice(crossIndex)
        chromosomeDaDa = chromosomeDaDa.concat(chromosomeMaMa.slice(crossIndex))

        newChromosomeMatrix.push(chromosomeDaDa)
    }
    return newChromosomeMatrix
}

//寻找适应度最高的染色体
//从数组中寻找最大的几个值
function maxArray(array, n) {
    //将一维数组升维
    var matrix = [];
    for (var i = 0; i < array.length; i++) {
        matrix.push([i, array[i]])
    }

    //排序对二维数组
    for (var i = 0; i < n; i++) {
        for (var j = 1; j < matrix.length; j++) {
            if (matrix[j - 1][1] > matrix[j][1]) {
                var temp = matrix[j - 1]
                matrix[j - 1] = matrix[j]
                matrix[j] = temp
            }
        }
    }

    //取n个最大值
    var maxIndexArray = [];
    for (var i = matrix.length - 1; i > matrix.length - n - 1; i--) {
        maxIndexArray.push(matrix[i][0])
    }
    return maxIndexArray
}

//复制
/*
 *@param chromosomeMatrix 上一代染色体矩阵
 *@param newChromosomeMatrix
 */
function copy(chromosomeMatrix, newChromosomeMatrix) {
    //寻找染色体适应度最高的N条染色体的下标(N=染色体数量*复制比例)
    var chromosomeIndexArr = maxArray(adaptability, chromosomeNum * cp)

    //复制
    for (var i = 0; i < chromosomeIndexArr.length; i++) {
        var chromosom = chromosomeMatrix[chromosomeIndexArr[i]];
        newChromosomeMatrix.push(chromosom)
    }

    return newChromosomeMatrix
}

//变异
/*
 *@param newChromosomeMatrix
 */
function mutation(newChromosomeMatrix) {
    //在交叉的基础上处理
    var chromosomeIndex = random(0, crossoverMutationNum - 1)

    //随机寻找一个任务
    var taskIndex = random(0, tasksNum - 1)

    var nodeIndex = random(0, nodeNum - 1)

    newChromosomeMatrix[chromosomeIndex][taskIndex] = nodeIndex

    return newChromosomeMatrix
}

//轮盘赌算法
/*
 *@param selectionProbability 每个染色体的适应度概率 下标染色体号 染色体对应的适应度概率
 *return 赶回概率数组中的下标
 */
function RWS(selectionProbability) {
    var sum = 0;
    var rand = Math.random(); //旋转用指针
    for (var i = 0; i < selectionProbability.length; i++) {
        //计算累计概率 画饼图
        sum += selectionProbability[i]
        if (sum >= rand) {
            return i;
        }
    }
}

//
function draw(resultData) {
    var myChart = echarts.init(document.getElementById('main')); // 指定图表的配置项和数据
    var option = {
        title: {
            text: '基于遗传算法的负载均衡调度'
        },
        tooltip : {
            trigger: 'axis',
            showDelay : 0,
            axisPointer:{
                show: true,
                type : 'cross',
                lineStyle: {
                    type : 'dashed',
                    width : 1
                }
            },
            zlevel: 1
        },
        legend: {
            data:['遗传算法']
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataZoom : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        xAxis : [
            {
                type : 'value',
                scale:true,
                name: '迭代次数'
            }
        ],
        yAxis : [
            {
                type : 'value',
                scale:true,
                name: '任务处理时间'
            }
        ],
        series : [
            {
                name:'任务处理时间',
                type:'scatter',
                large: true,
                symbolSize: 3,
                data: (function () {
                    var d = [];
                    for (var itIndex=0; itIndex<iteratorNum; itIndex++) {
                        for (var chromosomeIndex=0; chromosomeIndex<chromosomeNum; chromosomeIndex++) {
                            d.push([itIndex, resultData[itIndex][chromosomeIndex]]);
                        }
                    }
                    return d;
                })()
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}