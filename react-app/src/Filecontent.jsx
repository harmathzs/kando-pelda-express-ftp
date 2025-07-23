import React, {Component} from 'react';

export default class Filecontent extends Component {
    state = {
        isFileReceived: false,
        fileContent: null
    }

    componentDidMount() {
        if (!this.state.isFileReceived) {
            fetch("http://localhost:3333/ftp-file/almafa")
            .then(res => res.text())
            .then(res=>{
                this.setState({
                    isFileReceived: true,
                    fileContent: res
                });
            })
            .catch(console.warn);
        }
    }

    render() {
        console.log('Filecontent props', this.props);

        return <div>
            <p>This is the Filecontent component. File content:</p>
            <p>{this.state.fileContent}</p>
        </div>;
    }
}