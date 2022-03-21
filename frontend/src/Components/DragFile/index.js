import React, { Component } from 'react'

class DragAndDrop extends Component {  
  dropRef = React.createRef()  
  
  state = {
    dragging: false
  }
  
  handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter++  
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.props.setDrag(true)
    }
  }

  handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.setDrag(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.onDrop(e.dataTransfer.files)
      e.dataTransfer.clearData()
      this.dragCounter = 0    
    }
  }

  handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter--
    if (this.dragCounter > 0) return(
      this.props.setDrag(false)
    )
  }

  
  componentDidMount() {
    this.dragCounter = 0
    let div = this.dropRef.current
    div.addEventListener('dragenter', this.handleDragIn)
    div.addEventListener('dragleave', this.handleDragOut)
    div.addEventListener('dragover', this.handleDrag)
    div.addEventListener('drop', this.handleDrop)
  }  
  
  componentWillUnmount() {
    let div = this.dropRef.current
    div.removeEventListener('dragenter', this.handleDragIn)
    div.removeEventListener('dragleave', this.handleDragOut)
    div.removeEventListener('dragover', this.handleDrag)
    div.removeEventListener('drop', this.handleDrop)
  }  

  render() {
    return (
      <div ref={this.dropRef}>
        {this.props.children}
      </div>
    )
  }
}

export default DragAndDrop