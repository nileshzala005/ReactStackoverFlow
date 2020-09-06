
import React from "react";
import { ContextualMenu, Modal, IDragOptions } from 'office-ui-fabric-react';
import InfiniteScroll from "react-infinite-scroll-component";
const axios = require('axios');

const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
};

export default class Infinite extends React.Component {
    state = {
        items: Array.from({ length: 20 }),
        questions: [],
        isModalOpen: false,
        selectedItem: []
    };
    getQueFromStack(pageNumber: string) {
        let _this = this;
        var url = `https://api.stackexchange.com/2.2/questions?page=${pageNumber}&pagesize=100&order=asc&sort=activity&site=stackoverflow`;
        axios.get(url).then((resp: any) => {
            if (_this.state.questions.length > 0) {
                _this.setState({
                    questions: [..._this.state.questions, ...resp.data.items]
                })
            } else {
                _this.setState({
                    questions: resp.data.items
                })
            }
        });
    }
    componentDidMount() {
        this.getQueFromStack("1");
    }
    fetchMoreData = () => {
        var count = this.state.questions.length / 100 + 1;
        this.getQueFromStack(count.toString());
    };
    openModel(item: any) {
        this.setState({
            selectedItem: [item],
            isModalOpen: true
        })
    }
    render() {
        return (
            <div className="container">
                <button type="button" value="e" onClick={() => this.openModel("")}>OPEN</button>
                <small>Number of results : {this.state.questions.length}</small>
                {this.state.selectedItem.length > 0 &&
                    <Modal
                        isOpen={this.state.isModalOpen}
                        onDismiss={() => { this.setState({ isModalOpen: false }) }}
                        isBlocking={false}
                        containerClassName={"container"}
                        dragOptions={dragOptions}>
                        <section className="container" style={{ fontSize: "xxx-large" }}>
                            Question : <a href={this.state.selectedItem[0]["link"]} rel="noopener noreferrer" target="_blank">
                                <h1>{this.state.selectedItem[0]["title"]}</h1>
                            </a>
                        </section>
                    </Modal>}

                <div id="scrollableDiv" style={{ height: 800, overflow: "auto" }}>
                    <section className="text-gray-700 body-font overflow-hidden">
                        <div className="px-5 py-24 mx-auto">
                            <div className="-my-8">
                                <InfiniteScroll
                                    dataLength={this.state.questions.length}
                                    next={this.fetchMoreData}
                                    hasMore={true}
                                    loader={<h4>Loading...</h4>}
                                    scrollableTarget="scrollableDiv">
                                    {this.state.questions.map((item: any, index: any) => (
                                        <div key={index} className="py-8 flex border-t-2 border-gray-200 flex-wrap md:flex-no-wrap" title={index}>
                                            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                                                <span className="tracking-widest font-medium title-font text-gray-900" title="Author">{item.owner.display_name}</span>
                                                <span className="mt-1 text-gray-500 text-sm">{new Date(item.creation_date).toDateString()}</span>
                                            </div>
                                            <div>
                                                <a  className="text-orange-500"  onClick={() => this.openModel(item)} rel="noopener noreferrer"  target="_blank">
                                                    <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">{item.title}</h2>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </InfiniteScroll>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}
