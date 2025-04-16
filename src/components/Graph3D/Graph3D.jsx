import React from "react";

class Graph3D extends React.Component {
        render(){
            return (
                <>
                    <div>
                        <label>Показать точки
                            <input type="checkbox" checked />
                        </label>

                        <label>Показать грани
                            <input type="checkbox" checked />
                        </label>

                        <label>Показать полигоны
                            <input type="checkbox" checked />
                        </label>
                    </div>

                    <div>
                        <select>
                            <option value="cube">Куб</option>
                            <option value="cylinder">Цилиндр</option>
                            <option value="sphere">Шар</option>
                            <option value="torus">Бублик</option>
                        </select>
                    </div>
                </>
                
            );
        }
}

export default Graph3D;