import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Input, Select, Switch, Tabs } from 'antd'
import states from '~/assets/states'
const { Option } = Select
const { TabPane } = Tabs

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

// Address Form
const AddressForm = Form.create({ name: 'Address Form' })(props => {
  const {
    handleChange,
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
    <Form className="form" {...formItemLayout} onChange={handleChange}>
      <Form.Item label="Address Line 1" hasFeedback>
        {getFieldDecorator('Address', {
          rules: [{ required: true }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Address Line 2" hasFeedback>
        {getFieldDecorator('Address 2')(<Input />)}
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
  )
})

// Address Details Tab Pane
function AddressDetails(props) {
  let [enableTab, setEnableTab] = useState(true)
  let [activeKey, setActiveKey] = useState('billing')
  const { form } = props

  function toggleShowShipping(v) {
    setEnableTab(!enableTab)
    setActiveKey(activeKey === 'billing' && !v ? 'shipping' : 'billing')
  }

  function handleChange() {
    let values = form.getFieldsValue()
    props.callback(values)
  }

  return (
    <div className="address-details">
      <h1>Address Details</h1>
      <Tabs activeKey={activeKey} onTabClick={v => setActiveKey(v)}>
        <TabPane tab="Billing Address" key="billing">
          <h2>{!enableTab ? 'Billing ' : ''}Address</h2>
          <AddressForm handleChange={handleChange} />
        </TabPane>
        <TabPane tab="Shipping Address" key="shipping" disabled={enableTab}>
          <h2>Shipping Address</h2>
          <AddressForm handleChange={handleChange} />
        </TabPane>
      </Tabs>
      <Switch onChange={toggleShowShipping} defaultChecked={true} />
      <p className="small">Billing Address same as Shipping Address</p>
    </div>
  )
}

AddressDetails.propTypes = {
  callback: PropTypes.func
}

const mapStateToProps = state => ({
  profile: state.profile
})

const wrappedAddressDetails = Form.create({ name: 'AddressDetails' })(
  AddressDetails
)
export default connect(mapStateToProps)(wrappedAddressDetails)
