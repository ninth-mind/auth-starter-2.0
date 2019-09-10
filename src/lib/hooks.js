import { useEffect, useState } from 'react'
import axios from 'axios'

export function useServerProfile(profile) {
  let [newProfile, setProfile] = useState(profile)

  useEffect(() => {
    async function fetchData() {
      try {
        let r = await axios({
          method: 'get',
          url: `http://localhost:3000/api/me`
        })
        setProfile(r.data.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()

    return
  }, [newProfile])

  return newProfile
}
