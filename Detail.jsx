const Detail = () => {
    return (
        <div className='detail'>Detail
        <div className="user">
          <img src="./avatar.png" alt="" />
          <h2>Aditi Jha</h2>
          <p>howdy guyss</p>
        </div>
        <div className="info">
            <div className="option">
                <div className="title">
                    <span>Chat Settings</span>
                    <img src="./arrowUp.png" alt="" />
                </div>
            </div>
            <div className="option">
                <div className="title">
                    <span>Privacy & help</span>
                    <img src="./arrowUp.png" alt="" />
                </div>
            </div> <div className="option">
                <div className="title">
                    <span>Shared photos</span>
                    <img src="./arrowDown.png" alt="" />
                </div>
                <div className="photos">
                    <div className="photoItem">
                        <div className="photoDetail">
                        <img 
                        src="//copy and paste some image//" 
                        alt="" 
                        />
                        <span>photo_2024_2.png</span>
                    </div>
                    <img src="./download.png" alt="" />
                    </div>
                    <div className="photoItem">
                        <div className="photoDetail">
                        <img 
                        src="//copy and paste some image//" 
                        alt="" 
                        />
                        <span>photo_2024_2.png</span>
                    </div>
                    <img src="./download.png" alt="" className="icon"/>
                    </div>
                    <div className="photoItem">
                        <div className="photoDetail">
                        <img 
                        src="//copy and paste some image//" 
                        alt="" 
                        />
                        <span>photo_2024_2.png</span>
                    </div>
                    <img src="./download.png" alt="" className="icon"/>
                    </div>
                    <div className="photoItem">
                        <div className="photoDetail">
                        <img 
                        src="//copy and paste some image//" 
                        alt="" 
                        />
                        <span>photo_2024_2.png</span>
                    </div>
                    <img src="./download.png" alt="" className="icon"/>
                    </div>
                </div>
            </div> 
        <div className="option">
                <div className="title">
                    <span>Shared Files</span>
                    <img src="./arrowUp.png" alt="" />
                </div>
            </div>
        </div>
        <button>Block User</button>
        <button className="logout">Logout</button>
        </div>
)
}

export default Detail
