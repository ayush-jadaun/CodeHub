/**
 * @fileoverview Noticeboard page of the website.
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NavSpace from '../../components/NavSpace';
import Spinner from '../../components/Spinner/Spinner';
import Alert from '../../components/Alert/Alert';
import Footer from '../../components/Footer/Footer';
import '../pages.css';
import './Noticeboard.css';



//notice format to be displayed.
function Notice(props) {

  useEffect(()=>{
    toast.dismiss();
  },[])

  return (
    <div>
      <div className="notice-box">
        <div className="notice-title">{props.title}</div>
        <div className="notice-date">{props.date}</div>
        <div className="notice-body"><pre style={{ fontFamily: 'sans-serif', justifyContent: 'space-evenly' }}>{props.body}</pre></div>
      </div>
    </div>
  );
}

export default function NoticeBoard() {
  const [PageHtml, setPageHtml] = useState(<>
    <NavSpace />
    <Spinner />
  </>);

  //to update the page html with the fetched data or error message.
  const updatePageHtml = async () => {

    try {
      //fetching the all notice from the server.
      const NoticeboardAPIresponse = await axios.get(process.env.REACT_APP_SERVER_PATH + '/noticeboard');
      const noticeList = NoticeboardAPIresponse.data.data;

        //updating the page html with the fetched data.
      setPageHtml(<>
        <div>
          <div className="background-pink-blue" style={{ minHeight: '100vh' }}>
            <NavSpace />
            <div className='notice-heading'>Notice Board</div>
            {noticeList.map((notice) => {
              <Notice
                key={notice._id}
                title={notice.title}
                date={notice.date}
                body={notice.body}
              />
            })}
            <div className='notice-footer'>
              This was the last Notice from Computer Coding Club. Either no Notice prior to this was ever created or they have been deleted by the admins.
            </div>
          </div>
          <Footer />
        </div>
      </>);
    }
    catch (err) {

      //updating the page html with the error message.
      setPageHtml(
        <>
          <NavSpace />
          <div className="background-pink-blue" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Alert heading={"Couldn't fetch data"} body={"Check your internet connection and try again.."} />
          </div>
        </>
      );
    }
  }

  useEffect(() => {
    updatePageHtml();
  }, []);

// rendering the page html.
  return (
    <>{PageHtml}</>
  );
}