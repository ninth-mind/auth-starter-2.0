import React from 'react'
import { axiosWCreds, setLoading } from '~/lib/utils'
import { actions } from '~/store'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

class AddValue extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit() {
    const { dispatch } = this.props
    setLoading(true, dispatch)

    let { status, data } = await axiosWCreds({
      method: 'post',
      url: '/api/me',
      data: { toAdd: 1 }
    })
    if (status === 200 && data) {
      toast.success(`Value added. Now: ${data.data.value}`)
      this.props.dispatch({
        type: actions.VALUE,
        value: data.data.value
      })

      setLoading(false, dispatch)
    } else toast.error('Oops. There was an error')
  }

  render() {
    return (
      <div className="add-value">
        <button onClick={this.handleSubmit}>PLUS 1</button>
      </div>
    )
  }
}

export default connect()(AddValue)
