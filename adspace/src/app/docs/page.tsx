import React from 'react'
import { InstallationCode } from './components/install-code'
import { FrameworkUseCode } from './components/framework-use-code'
 
const page = () => {
  return (
    <div className='flex flex-col gap-2 pt-12'>
         <InstallationCode />
         <FrameworkUseCode />
    </div>
  )
}

export default page