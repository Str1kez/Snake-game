window.onload = function() { // при загрузке страницы выполняется функция
	document.addEventListener('keydown', move); // при нажатии клавиши
	setInterval(main,1000/60); // 60 fps
};
var
	canv	=	document.getElementById('snake'), // подключаем канвас
	con		=	canv.getContext('2d'), // как будем рисовать
	start =	fkey	=	false, // первая клавиша нажата/ начало игры
	speed = baseSpeed	=	3, // скорость змейки и ее начальная скорость
	px		=	~~(canv.width) / 2, // позиция головы
	py		=	~~(canv.height) / 2,
	xs = ys	=	0, // скорость по осям
	pw = ph	=	20, // размер головы
	aw = ah =	20, // размер яблока
	apples	=	[], // массив для яблок, оно будет не одно
	stail	=	[], // массив для хвоста
	tail	=	10, // начальный размер хвоста
	safe	=	20, // зона защиты от съедения
	cd		=	false; // небольшая задержка для кнопки, чтобы при повороте не съесть

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
		con.fillStyle = apples[ap].color; // cделаем разноцветными
		con.fillRect(apples[ap].x, apples[ap].y, aw,ah);
	}
	
	// проверим съедение
	for (var ap = 0; ap < apples.length;ap++){
		if 	(
			px < (apples[ap].x + aw) && (px + pw) > apples[ap].x
			&& py < (apples[ap].y + ah) && (py + ph) > apples[ap].y
			)
			{
				// попали на яблоко
				apples.splice(ap,1); // удаляем это яблоко из списка
				tail += 10; // увеличиваем длину змейки
				speed += 0.2; // увеличиваем скорость
				spawn(); // добавляем новое яблоко на поле
				break;
			}
	}
};

function spawn()
{
	var newapple = {
		x: Math.floor(Math.random() * canv.width), // спавним в любое место
		y: ~~(Math.random() * canv.height), // ~~ тоже округление
		color: 'randomcolor()'
	};
	
	// сделаем так, чтобы яблоко не было за границей поля
	if 	( (newapple.x > canv.width - aw) || (newapple.y > canv.height - ah) )
		{
			spawn(); // снова инициализируем функцию
			return;
		}	
	// проверка спавна яблока прямо на змейке
	
	for (var i = 0; i < stail.length; i++)
	{
		if 	(
				newapple.x < (stail[i].x + pw) && (newapple.x + pw) > stail[i].x 
				&& newapple.y < (stail[i].y + ph) && (newapple.y + ph) > stail[i].y
			)
			{
				spawn();
				return;
			}
	}
	
	// все условия выполнены, добавляем яблоко в список
	apples.push(newapple);
	
	// поставим 25% шанс на второе яблоко
	if (apples.length < 2 && (~~(Math.random() * 1000) < 250))
	{
		spawn();
	}
}

// добавим рандомный цвет яблока

function randomcolor()
{
	// выведем в hex, берем число от 0 до 255 и переводим в строку с двумя разрядами
	return '#' + (~~(Math.random() * 255)).toString(16) + (~~(Math.random() * 255)).toString(16) + (~~(Math.random() * 255)).toString(16);
}

// настроим контроль над змейкой
function move(e)
{
	// 37 - left, 38 - up, 39 - right. 40 - down
	// Начало игры
	if (!fkey && (e.keyCode == 37 ||  e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40))
		{
			start = fkey = true;
			spawn();
		}
	if (cd){
		return false;
	}
	switch (e.keyCode)
	{
		case 37:
			if(xs<=0){
				xs = -speed;
				ys = 0;
			}
			break;
		case 38:
			if(ys<=0){
				ys = -speed;
				xs = 0;
			}
			break;
		case 39:
			if(xs>=0){
				xs = speed;
				ys = 0;
			}
			break;
		case 40:
			if(ys>=0){
				ys = speed;
				xs = 0;
			}
			break;
	}
	cd = true;
	setTimeout(function(){cd = false;}, 110); // чтобы быстро не завернуть и не съесть себя
}







