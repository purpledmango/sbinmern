"use client"; // Required for client-side hooks

import ManageDeployment from '@/app/components/ManageDeployment';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router'; // Remove this if using App Router

const Page = () => {
  const params = useParams();
  const deploymentId = params.deploymentId; // Access from params object
  
  return (
    <div>
      <h1>URL Parameters</h1>
      <p>Deployment ID: {deploymentId}</p>
      <ManageDeployment/>
    </div>
  );
};

export default Page;