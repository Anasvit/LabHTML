function clearResult() 
{
    document.getElementById("result").textContent = "";
}

// Задание 1: Работа с переменными
function task1() 
{
    clearResult();
    let name;
    let admin;

    name = "Джон";
    admin = name;

    document.getElementById("result").textContent = admin;
    alert(admin)
}

// Задание 2: Исправить сложение
function task2() 
{
    clearResult();
    let a = prompt("Первое число?", "1");
    let b = prompt("Второе число?", "2");

    let sum = Number(a) + Number(b);

    document.getElementById("result").textContent = sum;
    alert(sum)
}

// Задание 3: Чётные числа от 2 до 10
function task3() 
{
    clearResult();
    let result = "";
    for (let i = 2; i <= 10; i += 2) 
    {
        result += i + " ";
    }
    document.getElementById("result").textContent = result;
}

// Задание 4: Заменить цикл for на while
function task4() 
{
    clearResult();
    let i = 0;
    let result = "";
    while (i < 3) 
    {
        result += `number ${i}! `;
        i++;
    }
    document.getElementById("result").textContent = result;
}

// Задание 5: Повторять, пока ввод неверен
function task5() 
{
    clearResult();
    let num;
    do 
    {
        num = prompt("Введите число больше 100:", "");
        if (num === null) 
        {
            document.getElementById("result").textContent = "Ввод отменён.";
            return;
        }
    } 
    while (Number(num) <= 100);

    document.getElementById("result").textContent = `Число ${num} — корректное!`;
}

// Задание 6: Простые числа от 2 до n
function task6() 
{
    clearResult();
    let input = prompt("Введите число n (поиск простых чисел от 2 до n):", "10");
    if (input === null) 
    {
        document.getElementById("result").textContent = "Ввод отменён.";
        return;
    }

    const n = Number(input);
    let primes = [];

    for (let i = 2; i <= n; i++) 
    {
        let isPrime = true;
        for (let j = 2; j < i; j++) 
        {
            if (i % j === 0) 
            {
                isPrime = false;
                break;
            }
        }
        if (isPrime) 
        {
            primes.push(i);
        }
    }

    document.getElementById("result").textContent = primes.join(", ");
}