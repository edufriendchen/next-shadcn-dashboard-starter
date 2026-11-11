export default function WorkspaceSettingsLoading() {
  return (
    <div className='flex flex-1 flex-col px-4 pt-2 pb-4 md:px-6 md:pt-4'>
      <div className='mb-4 space-y-2'>
        <div className='bg-muted h-8 w-56 animate-pulse rounded' />
        <div className='bg-muted h-4 w-96 animate-pulse rounded' />
      </div>
      <div className='bg-muted h-96 w-full max-w-3xl animate-pulse rounded-lg' />
    </div>
  );
}
