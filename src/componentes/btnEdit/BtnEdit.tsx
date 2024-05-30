function BtnEdit ({handleClick, height = '35px', width = '35px', color = '#39f'} : {handleClick: (value:any) => void, height?:string, width?:string, color?:string}) {
    return  <a className="btn mb-0" style={{height:height, width:width, marginBottom: 10, backgroundColor:color }} onClick={handleClick}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'translate(-20%, -25%)'}}>
                <path d="M0.863636 13.3342V16.6155H4.14489L13.8224 6.93797L10.5411 3.65672L0.863636 13.3342ZM16.3599 4.40047C16.7011 4.05922 16.7011 3.50797 16.3599 3.16672L14.3124 1.11922C13.9711 0.777969 13.4199 0.777969 13.0786 1.11922L11.4774 2.72047L14.7586 6.00172L16.3599 4.40047Z" fill="#231F20"/>
                </svg>
            </a>
}

export default BtnEdit;