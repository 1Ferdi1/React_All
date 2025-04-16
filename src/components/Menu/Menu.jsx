import React from 'react';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.showPage = props.showPage;
        this.pages = [
            'Graph3D', 
            'RPG', 
            'Calculator', 
            'Esse', 
            'Target', 
            'Graph2D'
        ];
    }

    render() {
        return (
            <div>
                {this.pages.map((page, index) => (
                    <button 
                        key={index} 
                        onClick={() => this.showPage(page)}>
                        {page}
                    </button>
                ))}
            </div>
        );
    }
}

export default Menu;