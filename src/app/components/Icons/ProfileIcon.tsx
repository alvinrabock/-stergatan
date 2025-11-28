import React from 'react'

const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width={512}
      height={512}
      viewBox="0 0 512 512"
      {...props}
    >
      <path d="M256 292.1c33 0 63.5-9.3 87.9-25.1 18.9-12.1 43.5-10.1 60.1 5 46.1 41.8 72.3 101.1 72.2 163.4v26.7c0 27.6-22.4 49.9-50 49.9H85.8c-27.6 0-50-22.3-50-49.9v-26.7c-.2-62.2 26-121.6 72.1-163.3 16.6-15.1 41.3-17.1 60.1-5 24.5 15.7 54.9 25 88 25z" />
      <circle cx={256} cy={123.8} r={123.8} />
    </svg>
  )
}

export default ProfileIcon
