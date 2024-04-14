import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

import { client } from '../../api/client'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)
const notificationsAdapter = createEntityAdapter({
  sortComparer: (a,b) => b.date.localeCompare(a.date)
}) 


const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state,action) {
      // we have to use Object.values(state.entities) to get an array of those notifications and loop over that.
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      notificationsAdapter.upsertMany(state,action.payload)
      // Sort with newest first
      Object.values(state).forEach(notification => {
        notification.isNew = !notification.read
      })
    })
  }
})

export const { allNotificationsRead } = notificationsSlice.actions
export default notificationsSlice.reducer

export const {
  selectAll: selectAllNotifications
} = notificationsAdapter.getSelectors(state => state.notifications)