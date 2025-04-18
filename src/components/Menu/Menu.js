const Menu = ({showPage}) => {
    return (<div>
        <button onClick={() => showPage('RPG')}>РПГ</button>
        <button onClick={() => showPage('Essay')}>Эссе</button>
        <button onClick={() => showPage('Graph3D')}>Графика 3д</button>
        <button onClick={() => showPage('Graph2D')}>Графика 2д</button>
        <button onClick={() => showPage('Calculator')}>Калькулятор</button>
        <button onClick={() => showPage('target')}>Мишени</button>
    </div>)
}

export default Menu;