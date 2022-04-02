import { Text } from 'slate'

function Serialize(children){
  return (
    <>{
      children?.map(node => {
        return CreateNode(node)
      })
    }</>
  )
}

function CreateNode(node){
  if (Text.isText(node)) {
    let element = <>{node.text}</>

    if(node.bold) element = <strong>{element}</strong>
    if(node.italic) element = <i>{element}</i>
    if(node.code) element = <code className="text-blue-400 px-[2px] bg-blue-50 dark:bg-zinc-700">{element}</code>
    if(node.underline) element = <u>{element}</u>

    return element
  }

  switch(node.type){
    case "code-block":
      return <code>{Serialize(node.children)}</code>
    case "block-quote":
      return <blockquote>{Serialize(node.children)}</blockquote>
    case "heading-one":
      return <h1>{Serialize(node.children)}</h1>
    default:
      return <p>{Serialize(node.children)}</p>
  }
}


function Serializer(nodes){
  if(!Array.isArray(nodes)) return null
    
  return (
    <div className="text-gray-700 dark:text-gray-300 py-2">{
      nodes?.map(node => {
        return CreateNode(node)
      })
    }</div>
  )

}

export default Serializer;