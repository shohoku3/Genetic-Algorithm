%初始化种群
%@param pop_size 种群大小
%@param chromo_size 染色体长度

function initpop(pop_size,chromo_size)
	global pop;
	for i=1:pop_size
		for j=1:chromo_size
			%round()四舍五入原则转化为指定小数位数
			pop(i,j)=round(rand)
		end
	end
	clear i;
	clear j;

%适应度计算函数
%@param pop_size 种群大小
%@param chromo_size 染色体长度
function fitness(pop_size,chromo_size)
	global fitness_value;
	global fitness_table;
	global fitness_avg;
	global best_fitness;
	global best_individual;
	global best_generation;
	global pop;
	global G;

	for i=1:pop_size
		fitness_table(i)=0
	end

	min=1;
	temp=1;
	