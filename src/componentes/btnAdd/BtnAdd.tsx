function BtnAdd ({handleClick, height = '35px', width = '35px', color = '#D5D5D5'} : {handleClick: (value:any) => void, height?:string, width?:string, color?:string}) {
    return  <a className="btn" style={{ height:height, width:width, marginBottom: 10, backgroundColor:color }} onClick={handleClick}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'translate(-15%, -22%)'}}>
                <path d="M14.5 8.5H8.5V14.5H6.5V8.5H0.5V6.5H6.5V0.5H8.5V6.5H14.5V8.5Z" fill="#231F20"/>
                </svg>
            </a>
}

export default BtnAdd;