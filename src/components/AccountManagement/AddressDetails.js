import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input } from 'antd'

function AddressDetails(props) {
  async function handleSubmit(e) {
    e.preventDefault()
    const { form, dispatch } = props
    let data = await form.validateFields()
    console.log(data)
  }

  const {
    form: { getFieldDecorator }
  } = props

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  }
  return (
    <div className="address-details">
      <h1>Address Details</h1>
      <Form className="form" {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Address" hasFeedback>
          {getFieldDecorator('Address', {
            rules: [{ required: true }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Address Line 2" hasFeedback>
          {getFieldDecorator('Address Line 2')(<Input />)}
        </Form.Item>
        <Form.Item label="City" hasFeedback>
          {getFieldDecorator('City')(<Input />)}
        </Form.Item>
        <Form.Item label="State" hasFeedback>
          {getFieldDecorator('State')(<Input />)}
        </Form.Item>
        <Form.Item label="ZIP Code" hasFeedback>
          {getFieldDecorator('ZIP Code')(<Input />)}
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

const mapStateToProps = state => ({
  profile: state.profile
})

const wrappedAddressDetails = Form.create({ name: 'AddressDetails' })(
  AddressDetails
)
export default connect(mapStateToProps)(wrappedAddressDetails)
