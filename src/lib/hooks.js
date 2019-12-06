import { useEffect, useState } from 'react'
import axios from 'axios'
import { redirect } from '~/lib/utils'
import { notification } from 'antd'

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
 *  ___  ___ ___ ___ ___ ___   _ _____ ___ ___
 * |   \| __| _ \ _ \ __/ __| /_\_   _| __|   \
 * | |) | _||  _/   / _| (__ / _ \| | | _|| |) |
 * |___/|___|_| |_|_\___\___/_/ \_\_| |___|___/
 *
 * @param {object} initialProfile - initial profile the user should have
 * @param {bool} blocking - boolean if it should redirect on profile failure
 */
export function useProfile(initialProfile, blocking = false) {
  let [profile, setProfile] = useState(initialProfile || {})

  useEffect(() => {
    async function fetchData() {
      try {
        let r = await axios({
          method: 'get',
          url: `/api/me`
        })

        let { token, user } = r.data.data

        setProfile({ ...user, token })
      } catch (err) {
        console.log(err)
        redirect('/c/login')
        notification.error({
          message: 'Oops',
          description: 'You are not logged in yet.'
        })
      }
    }

    fetchData()
    return
  }, [blocking])

  return profile
}
