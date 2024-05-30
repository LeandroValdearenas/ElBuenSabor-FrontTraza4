function BtnDelete ({handleClick, height = '35px', width = '35px', color = '#e55353'} : {handleClick: (value:any) => void, height?:string, width?:string, color?:string}) {
    return  <a className="btn mb-0" style={{ height:height, width:width, marginBottom: 10, backgroundColor:color }} onClick={handleClick}>
                <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'translate(-15%, -22%)'}}>
                <path d="M1.25 14.625C1.25 15.5875 2.0375 16.375 3 16.375H10C10.9625 16.375 11.75 15.5875 11.75 14.625V4.125H1.25V14.625ZM12.625 1.5H9.5625L8.6875 0.625H4.3125L3.4375 1.5H0.375V3.25H12.625V1.5Z" fill="#231F20"/>
                </svg>
            </a>
}

export default BtnDelete;