function clearResult() 
{
    document.getElementById("result").textContent = "";
}

//Часть 1
    // Задача 1
        // Найти максимальную разницу между элементами массива.
function task1_1() 
{
    clearResult();
    const input = prompt("Введите числа через запятую:", "1,4,6,3,2");
    const arr = input.split(",").map(x => parseFloat(x.trim())).filter(x => !isNaN(x));

    if (arr.length < 2) 
    {
        document.getElementById("result").textContent = "Массив слишком мал.";
        return;
    }

    let max = arr[0];
    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }
    const maxDiff = max - min;

    document.getElementById("result").textContent = `Макс. разница: ${maxDiff}`;
}

        // Вернуть массив без повторяющихся элементов.
function task1_2() 
{
    clearResult();
    const input = prompt("Введите элементы массива через запятую:", "1,2,2,3,3,3");
    const arr = input.split(",").map(x => x.trim());
    const unique = [];
    for (let i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) {
            unique.push(arr[i]);
        }
    }
    document.getElementById("result").textContent = `Без дубликатов: [${unique.join(", ")}]`;
}

        // Дан массив объектов, вернуть только те, у которых isDone: true.
        // [
        //     {id: 1, idDone: true}, 
        //     {id: 2, idDone: false},
        //     {id: 3, idDone: true}
        // ]
function task1_3() 
{
    clearResult();
    const data = [
        { id: 1, isDone: true },
        { id: 2, isDone: false },
        { id: 3, isDone: true }
    ];
    const filtered = data.filter(item => item.isDone);
    const ids = [];
    for (let i = 0; i < filtered.length; i++) {
        ids.push(filtered[i].id);
    }
    document.getElementById("result").textContent = `isDone: true -> [${ids.join(", ")}]`;
}


    // Задача 2
        // Найти элементы массива, которые больше указанного числа:
        // f([1, 4, 6, 3, 2], 2) -> [4, 6, 3]
function task2_1() 
{
    clearResult();
    const input = prompt("Введите массив чисел через запятую:", "1,4,6,3,2");
    const num = parseFloat(prompt("Введите пороговое число:", "2"));
    const arr = input.split(",").map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > num) {
            result.push(arr[i]);
        }
    }

    document.getElementById("result").textContent = `> ${num}: [${result.join(", ")}]`;
}

        // Дан многомерный массив произвольной вложенности. Написать функцию, делающую из него "плоский" массив:
        // f([1, 4, [34, 1, 20], [6, [6, 12, 8], 6]]) -> 
        // [1, 4, 34, 1, 20, 6, 6, 12, 8, 6]
function flatten(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (Array.isArray(item)) {
            let subFlat = flatten(item);
            for (let j = 0; j < subFlat.length; j++) {
                result.push(subFlat[j]);
            }
        } else {
            result.push(item);
        }
    }
    return result;
}

function task2_2() {
    clearResult();
    const input = prompt("Введите многомерный массив (например: [1,[2,[3]],4]):", "[1,4,[34,1,20],[6,[6,12,8],6]]");
    try {
        const arr = JSON.parse(input.replace(/'/g, '"'));
        const flat = flatten(arr);
        document.getElementById("result").textContent = `Плоский: [${flat.join(", ")}]`;
    } catch (e) {
        document.getElementById("result").textContent = "Ошибка: неверный формат массива.";
    }
}


    // Задача 3
        // Найти, сколько есть в массиве пар чисел, дающих в сумме 0:
        // f([-7, 12, 4, 6, -4, -12, 0]) -> 2 
        // f([-1, 2, 4, 7, -4, 1, -2]) -> 3
        // f([-1, 1, 0, 1]) -> 1
        // f([-1, 1, -1, 1]) -> 2
        // f([1, 1, 1, 0, -1]) -> 1
        // f([0, 0]) -> 1 
        // f([]) -> 0 
function task3_1() {
    clearResult();
    const input = prompt("Введите массив чисел:", "-7,12,4,6,-4,-12,0");
    const arr = input.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));

    let count = 0;
    let flag = [];
    
    for (let i = 0; i < arr.length; i++) {
        if (flag[i]) continue;
        
        for (let j = i + 1; j < arr.length; j++) {
            if (flag[j]) continue;
            
            if (arr[i] + arr[j] === 0) {
                count++;
                flag[i] = true;
                flag[j] = true;
                break; 
            }
        }
    }

    document.getElementById("result").textContent = `Пар с суммой 0: ${count}`;
}

        // То же самое, но найти количество троек таких чисел.
function task3_2() 
{
    clearResult();
    const input = prompt("Введите массив чисел:", "-1,2,4,7,-4,1,-2");
    const arr = input.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));

    let count = 0;
    const n = arr.length;

    for (let i = 0; i < n; i++) 
    {
        for (let j = i + 1; j < n; j++) 
        {
            for (let k = j + 1; k < n; k++) 
            {
                if (arr[i] + arr[j] + arr[k] === 0) 
                {
                    count++;
                }
            }
        }
    }

    document.getElementById("result").textContent = `Троек с суммой 0: ${count}`;
}



//Часть 2
    // Задача 1
        // Реализовать генератор, бесконечно возвращающий случайное число в заданном диапазоне random(n, m).
function* randomGenerator(n, m) 
{
    while (true) 
    {
        yield Math.floor(Math.random() * (m - n + 1)) + n;
    }
}

function task4_1() 
{
    clearResult();
    const n = parseInt(prompt("Введите начало диапазона:", "1"));
    const m = parseInt(prompt("Введите конец диапазона:", "10"));
    const gen = randomGenerator(n, m);
    const samples = Array.from({ length: 5 }, () => gen.next().value);
    document.getElementById("result").textContent = `5 случайных чисел: [${samples.join(", ")}]`;
}
        
        // Реализовать генератор, бесконечно возвращающий очередное число из последовательности Падована.
function* padovanGenerator() 
{
    let a = 1, b = 1, c = 1;
    yield a;
    yield b;
    yield c;
    while (true) 
    {
        const next = a + b;
        yield next;
        a = b;
        b = c;
        c = next;
    }
}

function task4_2() {
    clearResult();
    const gen = padovanGenerator();
    const seq = Array.from({ length: 10 }, () => gen.next().value);
    document.getElementById("result").textContent = `Падован: [${seq.join(", ")}]`;
}

        // Реализовать генератор, бесконечно возвращающий очередное простое число.
function isPrime(num) 
{
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) 
    {
        if (num % i === 0) return false;
    }
    return true;
}

function* primeGenerator() 
{
    let num = 2;
    while (true) 
    {
        if (isPrime(num)) yield num;
        num++;
    }
}

function task4_3() {
    clearResult();
    const gen = primeGenerator();
    const primes = Array.from({ length: 10 }, () => gen.next().value);
    document.getElementById("result").textContent = `Простые: [${primes.join(", ")}]`;
}



    // Задача 2
        // Посчитать число вхождений букв (или слов) в строке, используя Map.
function task5_1() 
{
    clearResult();
    const input = prompt("Введите строку:", "hello world hello");
    const words = input.trim().split(/\s+/);
    const map = new Map();

    for (const word of words) 
    {
        map.set(word, (map.get(word) || 0) + 1);
    }

    const result = Array.from(map.entries()).map(([k, v]) => `${k}:${v}`).join(", ");
    document.getElementById("result").textContent = `Частоты: ${result}`;
}
        
        // Написать функцию getPrime(n), возвращающее n-ное по счёту простое число, используя BigInt.
function getPrime(n) 
{
    if (n <= 0) return null;
    let count = 0;
    let num = 2n;

    while (true) 
    {
        if (isPrimeBig(num)) 
        {
            count++;
            if (count === n) return num;
        }
        num++;
    }
}

function isPrimeBig(num) 
{
    if (num < 2n) return false;
    for (let i = 2n; i * i <= num; i++) 
    {
        if (num % i === 0n) return false;
    }
    return true;
}

function task5_2() 
{
    clearResult();
    const n = parseInt(prompt("Введите номер простого числа:", "5"));
    if (isNaN(n) || n <= 0) 
    {
        document.getElementById("result").textContent = "Неверный ввод.";
        return;
    }
    const prime = getPrime(n);
    document.getElementById("result").textContent = `${n}-е простое: ${prime.toString()}`;
}