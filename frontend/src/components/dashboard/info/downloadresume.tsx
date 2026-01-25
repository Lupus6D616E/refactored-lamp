'use client';

export function ResumeDownload(){
    return(
        <div className="card bg-neutral text-neutral-content w-96">
        <div className="card-body items-center text-center">
            <h2 className="card-title">Download Resume</h2>
            <p>Download your resume.</p>
            <div className="card-actions justify-end">
            <button className="btn btn-primary"><a href='/user/downloadmyresume'>download</a></button>
            </div>
        </div>
</div>
    )
}