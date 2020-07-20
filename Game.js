window.onload = function() { // при загрузке страницы выполняется функция
	document.addEventListener('keydown', move); // при нажатии клавиши
	setInterval(main,1000/120); // 120 fps
};
var
	canv	=	document.getElementById('snake'), // подключаем канвас
	con		=	canv.getContext('2d'), // как будем рисовать
	start =	fkey	=	false, // первая клавиша нажата/ начало игры
	speed = baseSpeed	=	3, // скорость змейки и ее начальная скорость
	px		=	canv.width / 2, // позиция головы
	py		=	canv.height / 2,
	xs = ys	=	0, // скорость по осям
	pw = ph	=	20, // размер головы
	aw = ah =	20, // размер яблока
	apples	=	[], // массив для яблок, оно будет не одно
	stail	=	[], // массив для хвоста
	tail	=	10, // начальный размер хвоста
	safe	=	20, // зона защиты от съедения

// сама игра
	
function main () {
	
	// обновление канваса
	con.fillStyle =	'black';
	con.fillRect(0,0,canv.width,canv.height);
	
	// движение головы
	px += xs;
	py += ys;
	
	// перемещение змейки при выходе с игрового поля
	
	if(px > canv.width){ // уход вправо
		px = 0;
	}
	if (py > canv.height){ // уход вниз
		py = 0;
	}
	if (py + ph < 0){ // уход вверх
		py = canv.height;
	}
	if (px + pw < 0){ // уход влево
		px = canv.width;
	}
	
	// раскрасим змейку
	
	con.fillStyle = '#3bab07';
	for (var i = 0; stail.length > i; i++){ // каждое движение - строим змейку с конца до головы
		con.fillStyle = stail[i].color;
		con.fillRect(stail[i].x, stail[i].y, pw, ph);
	}
	stail.push({x: px, y: py, color: con.fillStyle}); // добавляем в очередь голову
	
	// рассмотрим переполнение
	
	if (stail.length > tail) { // удаляем хвост, если он стал больше значения длины
		stail.shift();
	}
	
	// съеденный
	
	if (stail.length > tail) { 
		stail.shift();
	}	
	
	// проверка на пересечение
	
	if (stail.length >= tail && start){
		
		for (var i = stail.length - safe; i >= 0; i--){
			
			// условие пересечения, что квадрат хвоста лежит внутри квадрата головы
			
			if ( 
				px < (stail[i].x + pw) && (px + pw) > stail[i].x 
				&& py < (stail[i].y + ph) && (py + ph) > stail[i].y
			)
			{
				// есть пересечение
				tail = 10;
				speed = baseSpeed; // ставим скорость подефолту
				for (var j = 0; j < stail.length - tail; j++){
					// выделим "отвалившийся конец"
					stail[j].color = '#ab0743';
				}
			}
		}
	}
	
	// покрасим яблоки
	
	for (var ap = 0; ap < apples.length;ap++)
	{
		con.fillStyle = apples[ap].color;
		con.fillRect(apples[ap].x, apples[ap].y, aw,ah);
	}
	
	
};	






