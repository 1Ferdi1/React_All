import { useState, useEffect, useCallback } from 'react';

const ROOMS = {
    start: { 
        title: "Комната в общаге", 
        description: "Надо меньше пить!", 
        img: "/RPGImg/obshaga.jpg", 
        exits: ["hall"] 
    },
    hall: { 
        title: "Холл", 
        description: "Широкий коридор с несколькими дверьми.", 
        img: "/RPGImg/holl.jpg", 
        exits: ["toilet", "start", "diningRoom"] 
    },
    toilet: { 
        title: "Туалет", 
        description: "Уютный туалет с мылом и бумагой.", 
        img: "/RPGImg/toilet.jpg", 
        exits: ["hall", "diningRoom"] 
    },
    diningRoom: { 
        title: "Столовая", 
        description: "Купи еду за монеты!", 
        img: "/RPGImg/diningRoom.jpg", 
        exits: ["hall", "toilet"] 
    }
};

const Rpg = () => {
    const [currentRoom, setCurrentRoom] = useState('start');
    const [hp, setHp] = useState(100);
    const [money, setMoney] = useState(0);
    const [botRoom, setBotRoom] = useState('start');

    // Логика перемещения бота
    const moveBot = useCallback(() => {
        setBotRoom(prev => {
            const exits = ROOMS[prev].exits;
            return exits.length > 0 
                ? exits[Math.floor(Math.random() * exits.length)]
                : prev;
        });
    }, []);

    // Первоначальное перемещение бота
    useEffect(() => {
        moveBot();
    }, [moveBot]);

    // Обработка смерти игрока
    useEffect(() => {
        if(hp <= 0) {
            alert("Вы потеряли все HP!");
            window.location.reload();
        }
    }, [hp]);

    // Проверка встречи с ботом
    useEffect(() => {
        if(currentRoom === botRoom) {
            const answer = prompt('Вы встретились с Родионовой. Что такое производная функции в точке?');
            
            if(answer?.toLowerCase() === 'касательная') {
                setHp(prev => prev + 30);
                alert('Правильно!');
            } else {
                setHp(0);
                alert('Неправильно! Вас ударили ножом, ваши HP = 0');
            }
        }
    }, [currentRoom, botRoom]);

    // Перемещение игрока
    const moveToRoom = (room) => {
        setHp(prev => prev - 10);
        setCurrentRoom(room);
        moveBot();
    };

    // Покупка еды
    const buyFood = () => {
        if(money >= 30) {
            setMoney(prev => prev - 30);
            setHp(prev => prev + 10);
            alert(`Вы купили еду! HP: ${hp + 10}, монеты: ${money - 30}`);
        } else {
            alert('Недостаточно монет!');
        }
    };

    const currentRoomData = ROOMS[currentRoom];

    return (
        <div className="rpg-game">
            <div className="room-info">
                <h1>{currentRoomData.title}</h1>
                <img src={currentRoomData.img} alt={currentRoomData.title} />
                <p>{currentRoomData.description}</p>
            </div>

            <div className="stats">
                <div>HP: {hp}</div>
                <div>Монеты: {money}</div>
            </div>

            <div className="exits">
                {currentRoomData.exits.map(exit => (
                    <button 
                        key={exit} 
                        onClick={() => moveToRoom(exit)}
                    >
                        Идти в {ROOMS[exit].title}
                    </button>
                ))}
            </div>

            {currentRoom === 'diningRoom' && (
                <button 
                    className="buy-food"
                    onClick={buyFood}
                >
                    Купить еду (30 монет - +10 HP)
                </button>
            )}
        </div>
    );
};

export default Rpg;