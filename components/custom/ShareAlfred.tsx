import React from 'react'
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
  } from 'next-share'
import {Share2} from 'lucide-react'

const ShareAlfred = ({userId}:{userId:string}) => {
    
  let shareUrl = `https://alfred-tau.vercel.app/Chatbot/${userId}`

  const shareButtons = [
    {
      Button: FacebookShareButton,
      Icon: FacebookIcon,
      props: {
        url: shareUrl,
        quote: 'Hey Guys, Meet my personal Alfred.',
        hashtag: '#Alfred #github/ManashAnand'
      }
    },
    {
      Button: TwitterShareButton,
      Icon: TwitterIcon,
      props: {
        url: shareUrl,
        title: 'Hey Guys, Meet my personal Alfred.'
      }
    },
    {
      Button: LinkedinShareButton,
      Icon: LinkedinIcon,
      props: {
        url: shareUrl
      }
    },
    {
      Button: WhatsappShareButton,
      Icon: WhatsappIcon,
      props: {
        url: shareUrl,
        title: 'Hey Guys, Meet my personal Alfred.'
      }
    }
  ];

  return (
    <>
       <div className=" mt-2 flex gap-2 items-center ">
            <Share2/>
            {shareButtons.map(({ Button, Icon, props }, index) => (
              <Button key={index} {...props}>
                <Icon size={32} round />
              </Button>
            ))}

          </div>
    </>
  )
}

export default ShareAlfred
