import { useState } from 'react'
import { Map } from './map/Map'
import Detail from './detail/Detail'
function App() {
  const [details, setDetails] = useState()
  return (
    <div className="App">
      <Map details={details} setDetails={setDetails}/>
      { details && details.length > 0? <Detail details={details}/>: <></> }
    </div>
  )
}

export default App