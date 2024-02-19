import { createContext, useReducer, useState } from "react";


const ScreensContext = createContext();

export const ScreensProvider = ({ children }) => {
    const [uris, setUris] = useState([]);
    const [areConstellationsVisible, setAreConstellationsVisible] = useState(true);
    //const [ coin, setCoin ] = useState(0);
    const [cantClicks, setCantClicks] = useState(0);
    const [userInfo, setUserInfo] = useState(undefined);
    const [tapsPerSecond, setTapsPerSecond] = useState(0);
    const [pointsPerClick, setPointsPerClick] = useState(1);
    const [upgradesUnlocked, setUpgradesUnlocked] = useState([]);
    const [allUpgrades, setAllUpgrades] = useState([]);
    const [pointsPerSecond, setPointsPerSecond] = useState(0);
    const [isMoonMoving, setIsMoonMoving] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(true);

    const reducer = (coin, action) => {
        switch (action.type) {
            case 'click':
                return coin + pointsPerClick;
                break;
            case 'cps':
                return coin + pointsPerSecond;
                break;
            case 'reduceByPurchase':
                return coin - action.value;
                break;
            case 'InitialValue':
                return action.value;
            default:
                break;
        }
    }

    const [coin, dispatch] = useReducer(reducer, 0);

    return (
        <ScreensContext.Provider value={{
            uris, setUris,
            areConstellationsVisible, setAreConstellationsVisible,
            //coin, setCoin,
            cantClicks, setCantClicks,
            userInfo, setUserInfo,
            tapsPerSecond, setTapsPerSecond,
            pointsPerClick, setPointsPerClick,
            upgradesUnlocked, setUpgradesUnlocked,
            allUpgrades, setAllUpgrades,
            pointsPerSecond, setPointsPerSecond,
            isMoonMoving, setIsMoonMoving,
            isMuted, setIsMuted,
            coin, dispatch,
            isLoggedOut,setIsLoggedOut
        }}>
            {children}
        </ScreensContext.Provider>
    )
}

export default ScreensContext;