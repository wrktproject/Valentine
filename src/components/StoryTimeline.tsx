import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pomegranitePhoto from '../assets/pomegranite.jpeg';
import likedYouPhoto from '../assets/ilikedyou.jpeg';
import favoriteDatePhoto from '../assets/favoritedate.jpeg';
import cherishPhoto from '../assets/amemoryicherish.jpeg';
import './StoryTimeline.css';

interface StoryTimelineProps {
  onComplete: () => void;
}

export const StoryTimeline = ({ onComplete }: StoryTimelineProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const memories = [
    {
      title: "The Day We Met",
      description: "It was a dark, quiet day in the Mo as you and Charlie talked about your roommate situation. I walk out of the elevator and hear Charlie complaining about a certain roommate to you. I say hello, unsure of who these two negative nancies are.\n\nWe get to know each other a bit, talking about college, life back home, future internships. The leaves swiftly drift back and forth outside on that windy autumn day.",
      emoji: "✨",
      photo: null,
    },
    {
      title: "Pomegranites",
      description: "Together, we have eaten ~100 pomegranites. I started this challenge alone on the first day of the program. One day, I left Jeff Seidel's early cause why not, and you joined. We somehow started talking about our favorite fruits and pomegranites were near the top for both of us.\n\nYou asked me to tell you next time I cut one, which did not happen. My bad. One day you and Dov found me on the roof preparing one and joined me. I learned that you have a sister Rachelle and that your favorite color is red. You learned that I apparently don't share much with my roommates and that I had a sister, Maya.\n\nThis led to many, many more pomegranite times going forward.",
      emoji: "😂",
      photo: pomegranitePhoto,
    },
    {
      title: "That Moment I Knew I Liked You",
      description: "Ketura. 2025. We were on the bus, about to leave for an excursion through the desert towards the dunes. I was one of the first on the bus, and pretty soon after, you followed suit. You sat next to me, and we talked for a few minutes.\n\nYou then said how tired you were, and I offered the window seat so you could rest. You declined for some reason, so I brushed it off until 30 seconds later when I realized what an absolute buffoon I was for not realizing.\n\nAs we left the gates of Ketura, I asked if you wanted to lean on my shoulder and you agreed. This moment, while small, has forever stuck in my mind as the first time I knew I liked you. Your head on my shoulder made me feel loved and special, and the dunes were so much more fun because of it.",
      emoji: "💕",
      photo: likedYouPhoto,
    },
    {
      title: "My favorite Date",
      description: "I had texted you to ask if I could speak with you in person. Didn't think much of it at the time but apparently you did that whole weekend. After we talk (and you almost thinking I was breaking up with you), I ask you to dinner next Tuesday after the tiyul.\n\nFast forward to that day and I'm freaking the f*** out on the bus ride home from the tiyul. The night before, Ori asked me if I was planning to kiss you and I didn't really know how to answer. That conversation sat with me for a while, until our barber (shoutout Ari) arrived. He cut my hair first, I showered, and then I walked up those steps to pick you up.\n\nLiora opens the door saying you'll be ready soon, and two minutes later, you walk out and I just can't help it but melt inside. Our walk is a bit far, especially in high heels, but you push through. In the restaurant, our view is amazing and we talk about our summer trips almost the whole time.\n\nI try to stay at your speed of eating, which is soooo slow so it was pretty difficult. While you're in the bathroom, I take care of the check which feels great to do. We talk for a bit longer and then take the light rail back to the shuk and walk back to our apartments.\n\nI loved this date. I found it fun and I learned a lot about you, but even more than that, it was our first real date and because it was so scary, it also felt super special and memorable.",
      emoji: "🤪",
      photo: favoriteDatePhoto,
    },
    {
      title: "A Memory I Cherish",
      description: "The day you got back from Ethiopia I was so excited. After internship, I walked to your apartment and arrived in the afternoon. Liora opens the door, smiles, and says that you're showering.\n\nShe begins telling me about your trip: the memories, food, bus, and eventually you take soooo long that Liora has to scream at you multiple times to hurry up. After like an hour, the water sound in the bathroom stops and Liora tells you that I'm here, and we hear a loud 'YAYYYY' from the bathroom, which was really funny and sweet.\n\nYou then walk out and run towards me in just a towel so Liora tells you to get dressed. After what feels like another hour (seriously, how long does it take to get dressed) you run out and go into my arms. You were so excited and smiley and my heart melted again. It was such an awesome experience.",
      emoji: "🌟",
      photo: cherishPhoto,
      caption: "Last one :)"
    }
  ];

  const selectedMemory = selectedIndex !== null ? memories[selectedIndex] : null;
  const modalWidth = selectedMemory
    ? selectedMemory.title === "My favorite Date"
      ? 900
      : Math.min(
          820,
          Math.max(
            600,
            Math.ceil(
              Math.max(...selectedMemory.description.split('\n\n').map(p => p.length)) * 2.2
            )
          )
        )
    : 600;

  return (
    <div className="story-timeline-container">
      <motion.div
        className="timeline-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="timeline-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our Story
        </motion.h1>

        <motion.div
          className="timeline-track"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {memories.map((memory, index) => (
            <motion.button
              key={memory.title}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              onClick={() => setSelectedIndex(index)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
            >
              <span className="timeline-dot" />
              <div className="timeline-card">
                <div className="memory-emoji">{memory.emoji}</div>
                <div className="memory-content">
                  <h2>{memory.title}</h2>
                  <p>Tap to open</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="unlock-section"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="unlock-text">So... ready to continue?</p>
          <motion.button
            className="unlock-button"
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            className="memory-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              className="memory-modal"
              style={{ maxWidth: `${modalWidth}px` }}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedIndex(null)}>
                ✕
              </button>
              <h2>{selectedMemory.title}</h2>
              <div className="modal-description">
                {selectedMemory.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              {selectedMemory.photo && (
                <div className="modal-scroll-hint">
                  <span>Scroll down</span>
                  <span className="scroll-chevron">⌄</span>
                </div>
              )}
              {selectedMemory.photo !== null && (
                <div className="modal-frame">
                  {selectedMemory.photo ? (
                    <img src={selectedMemory.photo} alt={selectedMemory.caption} />
                  ) : (
                    <div className="photo-placeholder">Add Photo</div>
                  )}
                </div>
              )}
              {selectedMemory.caption && (
                <p className="photo-caption">{selectedMemory.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
