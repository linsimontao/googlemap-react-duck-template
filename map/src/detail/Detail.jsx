import React from 'react'
import './Detail.css'
function Detail({ details }) {
  if (details) {
    return (
      <div className='detail'>
        <p className='title'>In Stock</p>
        <table className="table">
          <tr>
            <th>Name</th>
            <th>SKU1</th>
            <th>SKU2</th>
            <th>SKU3</th>
            <th>SKU4</th>
            <th>SKU5</th>
          </tr>
          {details && details.map(d => {
            return (
              <tr>
                <td>{d.name}</td>
                <td>{d.SKU1}</td>
                <td>{d.SKU2}</td>
                <td>{d.SKU3}</td>
                <td>{d.SKU4}</td>
                <td>{d.SKU5}</td>
              </tr>

            )
          })}
        </table>
      </div>
    )
  } else {
    return <></>
  }
}

export default Detail