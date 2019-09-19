import React from 'react'
function Bam(props) {
  return (
    <div className="page bam">
      <blockquote className="palette-yellow">
        This page is under construction... Gathering all the cool photos and
        prototypes
      </blockquote>
      <h2>IBM’s Proprietary Cloud Monitoring solution.</h2>
      <h4>THE PROBLEM</h4>
      <p>
        Historically, developers and IT teams have functioned in silos —
        separately building and then monitoring the performance of applications
        respectively. Around 10 years ago, a movement began to bring the two
        communities together into a new way of thinking and practicing: DevOps.{' '}
      </p>

      <p>
        DevOps enables teams to work faster and more efficiently: easily
        building, testing, releasing and monitoring software all under one
        umbrella. IBM's cloud platform, Bluemix, did not have any built in
        monitoring capabilities, so our team set out to create an experience
        that would enable developers (not just IT/Ops folks) to monitoring the
        applications they build in Bluemix.
      </p>

      <h4>THE SOLUTION</h4>
      <p>
        Our product, Bluemix Availability Monitoring (BAM as we call it), was
        made generally available in November 2016. It enables developers to
        monitor health automatically by integrating with any new applications
        they create in Bluemix. As the User Experience Engineer, I acted as a
        liaison between the design and the development side, as well as built
        prototypes for testing.
      </p>

      <p>
        You can try out the experience by creating an application on{' '}
        <a href="https://cloud.ibm.com">cloud.ibm.com</a>, or you can watch this
        cool video.
      </p>

      <video width="640" height="400" controls loop autoPlay>
        <source
          src="https://sudo-portfolio-space.sfo2.cdn.digitaloceanspaces.com/video/BAM-guide-video.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  )
}

export default Bam
