const Input = ({ set, log }) => {

  let input = (<input type="text" onChange={(event)=> set(event.target.value)} />)
  let add_btn = (<button>Add</button>)


  return (<div>

    <form onSubmit={(event) => {
      log()
      event.preventDefault()
    }}>
      {input}
      {add_btn}
    </form>
  </div>);
}

export default Input;