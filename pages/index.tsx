import useAspidaSWR from '@aspida/swr'
import Main from '~/components/main'
import { createApiClient } from '~/utils/apiClient'

const Home = () => {
  const apiClient = createApiClient()
  const { data: serverStatus, revalidate } = useAspidaSWR(apiClient.status)
  return (
    // <Main serverStatus={serverStatus} revalidate={revalidate} useLocalNetwork />
    <Main />
  )
}

export default Home
