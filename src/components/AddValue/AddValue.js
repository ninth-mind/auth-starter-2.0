import React from 'react'
import axios from 'axios'
import { setLoading } from '~/lib/utils'
import { actions } from '~/store'
import { connect } from 'react-redux'
import { notification, Button } from 'antd'

class AddValue extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit() {
    const { dispatch } = this.props
    setLoading(true, dispatch)

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
      this.props.dispatch({
        type: actions.VALUE,
        value: data.data.value
      })

      setLoading(false, dispatch)
    } else
      notification.error({
        message: 'Error Adding Value',
        description: 'There was error adding value to your account'
      })
  }

  render() {
    return (
      <div className="add-value">
        <Button onClick={this.handleSubmit}>PLUS 1</Button>
      </div>
    )
  }
}

export default connect()(AddValue)
