import React, {Component} from 'react';

export default class ImageGrid extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        console.log(this.props.bestImages)
        return (
            <div id="history-item-template">
            <figure>
                <img />
                <figcaption>
                    <span className="time"></span>
                    <span className="score"></span>
                </figcaption>
            </figure>
        </div>
        )
    }
}