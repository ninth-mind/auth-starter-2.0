import React from 'react'
import axios from 'axios'
import { setLoading } from '~/lib/utils'
import { actions } from '~/store'
import { connect } from 'react-redux'
import { Button, notification } from 'antd'

function AddValue(props) {
  const { dispatch } = props

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true, dispatch)

    try {
      let { status, data } = await axios({
        method: 'post',
        url: '/api/me',
        data: { toAdd: 1 }
      })
      if (status === 200 && data) {
        notification.success({
          message: 'Value Added',
          duration: 2
        })

        dispatch({
          type: actions.VALUE,
          value: data.data.value
        })
        setLoading(false, dispatch)
      }
    } catch (err) {
      notification.error({
        message: 'Error Adding Value',
        description: 'There was error adding value to your account'
      })
    }
  }

  return (
    <div className="add-value">
      <Button onClick={handleSubmit}>PLUS 1</Button>
    </div>
  )
}

export default connect()(AddValue)
