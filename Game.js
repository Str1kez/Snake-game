window.onload = function () { // при загрузке страницы выполняется функция
	document.addEventListener('keydown', move); // при нажатии клавиши
	setInterval(main, 1000 / 60); // 60 fps

};
// при уходе со страницы закидываем в локалку данные счета
window.onunload = function () {
	localStorage.setItem('bestscoreever', JSON.stringify(bestscoreever));
}

var
	canv = document.getElementById('snake'), // подключаем канвас
	con = canv.getContext('2d'), // как будем рисовать
	start = fkey = false, // первая клавиша нажата/ начало игры
	speed = baseSpeed = 3, // скорость змейки и ее начальная скорость
	px = ~~(canv.width) / 2, // позиция головы
	py = ~~(canv.height) / 2,
	xs = ys = 0, // скорость по осям
	pw = ph = 20, // размер головы
	aw = ah = 20, // размер яблока
	apples = [], // массив для яблок, оно будет не одно
	stail = [], // массив для хвоста
	tail = 10, // начальный размер хвоста
	safe = 20, // зона защиты от съедения
	cd = false, // небольшая задержка для кнопки, чтобы при повороте не съесть
	score = 0, // показывает счёт
	bestscore = 0, // лучший счёт за данную игру
	bestscoreever = JSON.parse(localStorage.getItem('bestscoreever')), // берем из локалки файл с топскором
	clr = '#3bab07', // изменение цвета змейки
	clrf = 'black', // цвет поля
	clrb = 'white', // цвет границы
	body = document.getElementsByTagName('body'), // элемент тэга для изменения цвета страницы
	button = document.getElementsByClassName('buttons'); // список кнопок 

// *сама игра	
function main() {

	Buttons();

	// обновление канваса, иначе все нарисованное останется 
	con.fillStyle = clrf;
	con.fillRect(0, 0, canv.width, canv.height);

	// раздел под счет
	con.beginPath();
	con.lineWidth = 2;
	con.moveTo(0, 65);
	con.lineTo(1400, 65);
	con.strokeStyle = clrb;
	con.stroke();

	// движение головы
	px += xs;
	py += ys;

	// перемещение змейки при выходе с игрового поля
	if (px > canv.width) { // уход вправо
		px = 0;
	}
	if (py > canv.height) { // уход вниз
		py = 66;
	}
	if (py < 66) { // уход вверх
		py = canv.height;
	}
	if (px < 0) { // уход влево
		px = canv.width;
	}

	// раскрасим змейку
	con.fillStyle = clr;
	for (var i = 0; stail.length > i; i++) { // каждое движение - строим змейку с конца до головы
		con.fillStyle = stail[i].color;
		con.fillRect(stail[i].x, stail[i].y, pw, ph);
	}

	stail.push({ x: px, y: py, color: con.fillStyle }); // добавляем в очередь голову

	// рассмотрим переполнение
	if (stail.length > tail) { // удаляем хвост, если он стал больше значения длины
		stail.shift();
	}

	// съеденный
	if (stail.length > tail) {
		stail.shift();
	}

	// проверка на пересечение
	if (stail.length >= tail && start) {

		for (var i = stail.length - safe; i >= 0; i--) {

			// условие пересечения, что квадрат хвоста лежит внутри квадрата головы
			if (
				px < (stail[i].x + pw) && (px + pw) > stail[i].x
				&& py < (stail[i].y + ph) && (py + ph) > stail[i].y
			) {
				// есть пересечение
				tail = 10;
				speed = baseSpeed; // ставим скорость подефолту
				score = 0; // обнуляем счет
				for (var j = 0; j < stail.length - tail; j++) {
					// выделим "отвалившийся конец"
					if (button[2].title == 'Yellow') {
						stail[j].color = '#ab0743';
					} else {
						stail[j].color = '#2b6dff';
					}
				}
			}
		}
	}

	// покрасим яблоки
	for (var ap = 0; ap < apples.length; ap++) {
		con.fillStyle = apples[ap].color; // cделаем разноцветными
		con.fillRect(apples[ap].x, apples[ap].y, aw, ah);
	}

	// проверим съедение
	for (var ap = 0; ap < apples.length; ap++) {
		if (
			px < (apples[ap].x + aw) && (px + pw) > apples[ap].x
			&& py < (apples[ap].y + ah) && (py + ph) > apples[ap].y
		) {
			// попали на яблоко
			apples.splice(ap, 1); // удаляем это яблоко из списка, (shift может удалить несъеденные яблоки)
			tail += 10; // увеличиваем длину змейки
			speed += 0.2; // увеличиваем скорость
			score += 50; // добавляем очки
			if (bestscore < score) { bestscore = score };
			if (bestscoreever < bestscore) { bestscoreever = bestscore };
			// если два яблока, то не добавляем
			if (apples.length == 0) {
				spawn(); // добавляем новое яблоко на поле
			}
			break;
		}
	}
	// добавим скорборд
	con.fillStyle = clrb;
	con.font = '30px Arial';
	con.fillText('SCORE: ' + score, 45, 60);
	con.font = '30px Arial';
	con.fillText('CURRENT BESTSCORE: ' + bestscore, 900, 60);
	con.font = '30px Arial';
	con.fillText('BESTSCORE: ' + bestscoreever, 420, 60);
};

function spawn() {
	var newapple = {
		x: Math.floor(Math.random() * canv.width), // спавним в любое место
		y: ~~(Math.random() * canv.height), // ~~ тоже округление
		color: randomcolor2() // разноцветные яблоки
	};

	// сделаем так, чтобы яблоко не было за границей поля, второе условие чтобы не было яблока на скорборде
	if ((newapple.x > canv.width - aw) || (newapple.y > canv.height - ah) || (newapple.y < 65)) {
		spawn(); // снова инициализируем функцию
		return;
	}

	// проверка спавна яблока прямо на змейке
	for (var i = 0; i < stail.length; i++) {
		if (
			newapple.x < (stail[i].x + pw) && (newapple.x + aw) > stail[i].x
			&& newapple.y < (stail[i].y + ph) && (newapple.y + ah) > stail[i].y
		) {
			spawn();
			return;
		}
	}

	// все условия выполнены, добавляем яблоко в список
	apples.push(newapple);

	// второе яблоко, если съедено 10 подряд
	if (apples.length == 1 && score % 500 == 0 && score > 0) {
		spawn();
	}
}

// добавим рандомный цвет яблока через rgb
function randomcolor2() {
	return 'rgb(' + (~~(Math.random() * 255)).toString() + ', ' + (~~(Math.random() * 255)).toString() + ', ' + (~~(Math.random() * 255)).toString() + ')';
};

// настроим контроль над змейкой
function move(e) {
	// 37 - left, 38 - up, 39 - right. 40 - down
	// Начало игры
	if (!fkey && (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)) {
		start = fkey = true;
		spawn();
	}
	if (cd) {
		return false;
	}
	switch (e.keyCode) {
		case 37:
			if (xs <= 0) {
				xs = -speed;
				ys = 0;
			}
			break;
		case 38:
			if (ys <= 0) {
				ys = -speed;
				xs = 0;
			}
			break;
		case 39:
			if (xs >= 0) {
				xs = speed;
				ys = 0;
			}
			break;
		case 40:
			if (ys >= 0) {
				ys = speed;
				xs = 0;
			}
			break;
	}
	cd = true;
	setTimeout(function () { cd = false; }, 90); // чтобы быстро не завернуть и не съесть себя
}

function Buttons() {
	// имзенение цвета страницы
	if (button[1].title == 'Brown') {
		button[1].onclick = function () {
			body[0].style.backgroundColor = '#63e3f2';
			document.getElementsByClassName('text')[0].style.color = 'black';
			document.getElementsByClassName('text')[1].style.color = 'black';
			document.getElementsByClassName('text')[2].style.color = 'black';
			button[1].title = 'SkyBlue';
		}
	}
	else {
		button[1].onclick = function () {
			body[0].style.backgroundColor = '#2B1C1C';
			document.getElementsByClassName('text')[0].style.color = 'white';
			document.getElementsByClassName('text')[1].style.color = 'white';
			document.getElementsByClassName('text')[2].style.color = 'white';
			button[1].title = 'Brown'
		}
	}

	// изменение цвета змейки
	if (button[2].title == 'Yellow') {
		button[2].style.backgroundColor = '#fff001';
		button[2].onclick = function () {
			clr = '#fff001';
			for (var i = 0; i < stail.length; i++) {
				stail[i].color = clr; // меняем цвет всей змейки
			}
			button[2].title = 'Green';
		};
	}
	else {
		button[2].style.backgroundColor = '#3bab07';
		button[2].onclick = function () {
			clr = '#3bab07';
			for (var i = 0; i < stail.length; i++) {
				stail[i].color = clr;
			}
			button[2].title = 'Yellow';
		};
	}

	// изменение цвета поля
	if (button[0].title == 'Dark') {
		button[0].onclick = function () {
			clrf = '#b3c4c4';
			document.getElementById('snake').style.backgroundColor = clrf;
			document.getElementById('snake').style.borderColor = clrb = 'black';
			button[0].title = 'light';
		}
	}
	else {
		button[0].onclick = function () {
			clrf = 'black';
			document.getElementById('snake').style.backgroundColor = 'black';
			document.getElementById('snake').style.borderColor = clrb = 'white';
			button[0].title = 'Dark';
		}
	}
	// пауза
	button[3].onclick = function () {
		if (start) { alert('GAME IS PAUSED\n' + 'Press OK to continue...'); }
		else {
			alert('GAME DIDNT START');
		}
	}
	// мануал
	if (button[4].title == 'Show') {
		button[4].onclick = function () {
			document.getElementsByTagName('img')[0].style.visibility = 'visible';
			button[4].title = 'Hide';
			button[4].value = 'Close';
			button[4].style.backgroundColor = 'red';
			button[4].style.color = 'white'
		};
	}
	else {
		button[4].onclick = function () {
			document.getElementsByTagName('img')[0].style.visibility = 'hidden';
			button[4].title = 'Show';
			button[4].value = 'Manual';
			button[4].style.backgroundColor = 'white';
			button[4].style.color = 'black'
		};
	};
}




