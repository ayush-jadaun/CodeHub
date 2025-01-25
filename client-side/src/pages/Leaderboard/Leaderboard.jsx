/**
 * @fileoverview Show the leaderboard of the users based on their Codeforces rating.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import NavSpace from '../../components/NavSpace';
import Spinner from '../../components/Spinner/Spinner';
import Alert from '../../components/Alert/Alert';
import Footer from '../../components/Footer/Footer';
import '../pages.css';
import './Leaderboard.css';

//User detail box.
function LeaderUser(props) {

    const navigate = useNavigate()

    useEffect(()=>{
        toast.dismiss();
    },[])

    //Function to navigate to the user's profile page.
    function handleUserClick(){
        navigate(`/get-codeforces-profile/${props.name}`)
    }
    
    return (
        //single user detail box.
        <div>
           <div className="leader-box" onClick={()=>handleUserClick()}>
                <div className=''>
                    <span style={{ marginRight: '5px' }}>

                        <b>#{props.rank}</b>
                    </span>
                    <span>
                        {props.name}
                    </span>
                </div>
            </div>
        </div>
    );
}

//Leaderboard component.
export default function Leaderboard() {

    const { user } = useSelector((state) => state.auth); //get the user details from the redux store.

    const [cfFetch,setcfFetch] = useState(false);

    console.log(cfFetch)
    
    //State of html page to be rendered.
    const [PageHtml, setPageHtml] = useState(<>
        <NavSpace />
        <Spinner />
    </>);

    //Function to sort the users by their Codeforces rating.
   async function SortUsersByRating(userBoardInfo){

            setcfFetch(true);

            //List of all the Codeforces contests.
            const contests = await axios.get('https://codeforces.com/api/contest.list')
            const contests_data = contests.data.result;

            //Finding the latest contest id.
            var latestContestId;
            for(const contest of contests_data){
                if(contest.phase === "FINISHED"){
                    latestContestId = contest.id;
                    break;
                }
            }

            //Users who have given latest contest
            const users = await axios.get(`https://codeforces.com/api/contest.ratingChanges?contestId=${latestContestId}`)
            const userRatings = [];

            //store rating of the users of CodeHub who have given the latest contest else rating is N/A.
            for (const userInfo of userBoardInfo) {
                var user = users.data.result.find((usr)=>usr.handle === userInfo.cfID)
                   if(!user){
                        userRatings.push({handle:userInfo.cfID, rating: "N/A"})
                   }
                   else{
                        userRatings.push({handle:user.handle, rating: user.newRating})
                   }
            }

           // Sort the users by rating in decreasing order
            userBoardInfo.sort((a, b) => {
                const aRating = userRatings.find((user) => user.handle === a.cfID).rating;
                const bRating = userRatings.find((user) => user.handle === b.cfID).rating;
                if (aRating === "N/A" && bRating === "N/A") {
                  return 0;
                } else if (aRating === "N/A") {
                  return 1;
                } else if (bRating === "N/A") {
                  return -1;
                } else {
                  return bRating - aRating;
                }
              });
   }

   //Function to update the page html.
    const updatePageHtml = async () => {

        try {
            // Fetching cfid of all the users from the server.
            const LeaderboardAPIresponse = await axios.post(process.env.REACT_APP_SERVER_BASE_URL + '/leaderboard', { cfID: user.cfID }, { withCredentials: true });

            //Sort the users by their Codeforces rating.
            const userBoardInfo = LeaderboardAPIresponse.data.data;
            await SortUsersByRating(userBoardInfo)

            //Create the LeaderUser component for each user.
            const LeaderComponent = userBoardInfo.map((userInfo, index) => <LeaderUser key={index} name={userInfo.cfID} rank={index + 1} _id={userInfo._id} />);

            //set the html of the page.
            setPageHtml(<>
                <div>
                    <div className="background-pink-blue">
                        <NavSpace />
                        <div className='leader-heading'>Leaderboard</div>
                        <p style={{'textAlign':'center'}}>Inactive participant's ratings are considered 0(zero).</p>
                        <div>
                            {LeaderComponent}
                        </div>
                    </div>
                    <Footer />
                </div>
            </>);
        } catch (err) {

            //set the html page if error is encountered.
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

//returning the page.
    return (
        <>{PageHtml}</>
    );
}
