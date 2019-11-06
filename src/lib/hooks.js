import { useEffect, useState } from 'react'
import axios from 'axios'
import ls from 'local-storage'
import { config } from '~/store'
import { redirect } from '~/lib/utils'
import { actions } from '~/store'

/**
 *
 * @param {object} initialProfile - initial profile the user should have
 * @param {bool} blocking - boolean if it should redirect on profile failure
 */
export function useProfile(initialProfile, blocking = false, dispatch) {
  let [profile, setProfile] = useState(initialProfile || {})

  useEffect(() => {
    async function fetchData() {
      try {
        let headers = {}
        const localStoredObj = ls.get(config.APP_NAME)
        if (localStoredObj) {
          headers.Authorization = `Bearer ${localStoredObj.token}`
        }

        let r = await axios({
          method: 'get',
          url: `/api/me`,
          headers
        })

        let { token, user } = r.data.data
        // set token in localstorage
        if (token) ls.set(config.APP_NAME, { token })
        setProfile(user)
        dispatch({
          type: actions.CREDS,
          ...user
        })
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
    return
  }, [blocking, dispatch])

  return profile
}

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
