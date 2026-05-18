function out(text)
{
    document.getElementById("answer").textContent = text;
}

function arrayTask1()
{
    let numbers = JSON.parse(prompt("Массив чисел", "[5, 1, 8, 5, 2, 8]"));
    let things = [
        {name: "первая", isDone: true},
        {name: "вторая", isDone: false},
        {name: "третья", isDone: true}
    ];

    let max = Math.max(...numbers);
    let min = Math.min(...numbers);
    let unique = [...new Set(numbers)];
    let done = things.filter(item => item.isDone);

    out(
        "Максимальная разница: " + (max - min) + "\n" +
        "Без повторов: " + JSON.stringify(unique) + "\n" +
        "Готовые объекты: " + JSON.stringify(done)
    );
}

function arrayTask2()
{
    let numbers = JSON.parse(prompt("Массив чисел", "[1, 4, 6, 3, 2]"));
    let limit = Number(prompt("Число", "2"));
    let nested = JSON.parse(prompt("Вложенный массив", "[1, 4, [34, 1, 20], [6, [6, 12, 8], 6]]"));

    out(
        "Больше числа: " + JSON.stringify(numbers.filter(item => item > limit)) + "\n" +
        "Плоский массив: " + JSON.stringify(nested.flat(Infinity))
    );
}

function arrayTask3()
{
    let numbers = JSON.parse(prompt("Массив чисел", "[-1, 2, 4, 7, -4, 1, -2]"));
    let usedPairs = [];
    let usedTriples = [];
    let pairs = 0;
    let triples = 0;

    for (let i = 0; i < numbers.length; i++)
    {
        usedPairs[i] = false;
        usedTriples[i] = false;
    }

    for (let i = 0; i < numbers.length; i++)
    {
        for (let j = i + 1; j < numbers.length; j++)
        {
            if (!usedPairs[i] && !usedPairs[j] && numbers[i] + numbers[j] === 0)
            {
                usedPairs[i] = true;
                usedPairs[j] = true;
                pairs++;
            }
        }
    }

    for (let i = 0; i < numbers.length; i++)
    {
        for (let j = i + 1; j < numbers.length; j++)
        {
            for (let k = j + 1; k < numbers.length; k++)
            {
                if (!usedTriples[i] && !usedTriples[j] && !usedTriples[k] && numbers[i] + numbers[j] + numbers[k] === 0)
                {
                    usedTriples[i] = true;
                    usedTriples[j] = true;
                    usedTriples[k] = true;
                    triples++;
                }
            }
        }
    }

    out("Пар с суммой 0: " + pairs + "\nТроек с суммой 0: " + triples);
}

function* randomNumbers(from, to)
{
    while (true)
    {
        yield Math.floor(Math.random() * (to - from + 1)) + from;
    }
}

function* padovanNumbers()
{
    let arr = [1, 1, 1];
    let i = 0;

    while (true)
    {
        if (i < 3)
        {
            yield arr[i];
        }
        else
        {
            arr[i] = arr[i - 2] + arr[i - 3];
            yield arr[i];
        }

        i++;
    }
}

function simplePrime(num)
{
    for (let i = 2; i < num; i++)
    {
        if (num % i === 0)
        {
            return false;
        }
    }

    return num > 1;
}

function* primeGenerator()
{
    let number = 2;

    while (true)
    {
        if (simplePrime(number))
        {
            yield number;
        }

        number++;
    }
}

function take(generator, count)
{
    let result = [];

    for (let i = 0; i < count; i++)
    {
        result.push(generator.next().value);
    }

    return result;
}

function generatorTask1()
{
    let from = Number(prompt("От", "1"));
    let to = Number(prompt("До", "10"));
    let count = Number(prompt("Сколько вывести", "8"));

    out(
        "random: " + JSON.stringify(take(randomNumbers(from, to), count)) + "\n" +
        "Падован: " + JSON.stringify(take(padovanNumbers(), count)) + "\n" +
        "Простые: " + JSON.stringify(take(primeGenerator(), count))
    );
}

function generatorTask2()
{
    let text = prompt("Строка", "кот кот дом дом дом");
    let number = Number(prompt("Номер простого числа", "10"));
    let map = new Map();
    let words = text.toLowerCase().split(" ");

    for (let word of words)
    {
        if (word !== "")
        {
            map.set(word, (map.get(word) || 0) + 1);
        }
    }

    let result = "Слова:\n";

    for (let item of map)
    {
        result += item[0] + " - " + item[1] + "\n";
    }

    result += "\nПростое число: " + getPrime(number).toString();
    out(result);
}

function getPrime(number)
{
    let prime = 1n;
    let count = 0;

    while (count < number)
    {
        prime++;

        let isPrime = true;
        for (let i = 2n; i * i <= prime; i++)
        {
            if (prime % i === 0n)
            {
                isPrime = false;
            }
        }

        if (isPrime)
        {
            count++;
        }
    }

    return prime;
}
