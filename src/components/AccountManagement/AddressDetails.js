import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Input, Select } from 'antd'
const { Option } = Select
import states from '~/assets/states'

// Country Options
function getStateOptions() {
  let options = []
  for (let [key, value] of Object.entries(states)) {
    options.push(
      <Option key={key} value={value}>
        {value}
      </Option>
    )
  }
  return options
}

function AddressDetails(props) {
  const {
    form,
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

  function handleChange() {
    let values = form.getFieldsValue()
    props.callback(values)
  }

  return (
    <div className="address-details">
      <h1>Address Details</h1>
      <Form className="form" {...formItemLayout} onChange={handleChange}>
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
          {getFieldDecorator('State')(
            <Select
              showSearch
              placeholder="Select a Country"
              optionFilterProp="children"
            >
              {getStateOptions()}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="ZIP Code" hasFeedback>
          {getFieldDecorator('ZIP Code')(<Input />)}
        </Form.Item>
      </Form>
    </div>
  )
}

AddressDetails.propTypes = {
  callback: PropTypes.func.required
}

const mapStateToProps = state => ({
  profile: state.profile
})

const wrappedAddressDetails = Form.create({ name: 'AddressDetails' })(
  AddressDetails
)
export default connect(mapStateToProps)(wrappedAddressDetails)
