import { useEffect, useState } from 'react'
import axios from 'axios'
import { redirect } from '~/lib/utils'
import { notification } from 'antd'
import { actions } from '~/store'

/**
 *
 * @param {string} endpoint - endpoint to fetch from strapi api
 */
export function useStrapi(endpoint) {
  let [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        let r = await axios({
          method: 'get',
          url: `http://localhost:1337${endpoint}`
        })
        setData(r.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
    return
  }, [endpoint])

  return data
}

/**
 * Generate PaymentIntent
 */

export function useGetPaymentIntent(total, customerId, paymentIntentId) {
  console.log('customer id', customerId)
  let [intentId, setIntentId] = useState(null)
  //TODO grab customer ID from user before fetching payment intent
  useEffect(() => {
    // run checks
    if (paymentIntentId) {
      console.log('here')
      return
    }
    if (total <= 0.5) return
    async function fetchIntent() {
      // call server, to update or create payment intent
      try {
        // grab existing payment intent if one exists
        let r = await axios({
          method: 'post',
          url: `/api/payment/intent`,
          data: {
            amount: total * 100,
            payment_method_types: ['card'],
            currency: 'usd',
            customerId
          }
        })

        // store payment intent with localstorage
        let paymentIntentId = r.data.data.id
        setIntentId(paymentIntentId)
        return
      } catch (err) {
        console.log('THIS ERRORED', err)
        // handleError(err)
      }
    }
    fetchIntent()
    return
  }, [customerId, paymentIntentId, total])

  return intentId
}

/**
 *
 *  ___  ___ ___ ___ ___ ___   _ _____ ___ ___
 * |   \| __| _ \ _ \ __/ __| /_\_   _| __|   \
 * | |) | _||  _/   / _| (__ / _ \| | | _|| |) |
 * |___/|___|_| |_|_\___\___/_/ \_\_| |___|___/
 *
 * Use Profile
 * used to fetch the full profile from the server, alternatively is
 * able to block calls made to a page when the user is not authorized
 *
 * @param {object} initialProfile - initial profile the user should have
 * @param {bool} blocking - boolean if it should redirect on profile failure
 */
export function useProfile(initialProfile, blocking = false, dispatch) {
  let [profile, setProfile] = useState(initialProfile || {})

  useEffect(() => {
    async function fetchData() {
      try {
        let r = await axios({
          method: 'get',
          url: `/api/me`
        })

        let { token, user } = r.data.data
        const payload = { ...user, token }
        setProfile(payload)

        if (Object.keys(payload).length && dispatch) {
          dispatch({
            type: actions.CREDS,
            ...payload
          })
        }
      } catch (err) {
        if (err.request.status === 403 && blocking) {
          redirect('/c/login')
          notification.error({
            message: 'Oops',
            description: 'You are not logged in yet.'
          })
        } else {
          console.log('user is not logged in.')
        }
      }
    }

    fetchData()
    return
  }, [blocking, dispatch])

  return profile
}
