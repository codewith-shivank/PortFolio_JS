import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedText — Premium text reveal animations
 * Supports: split (letter-by-letter), words, lines, typing
 */
export default function AnimatedText({
  text,
  tag = 'h2',
  animation = 'words',
  className = '',
  delay = 0,
  staggerDelay = 0.03,
  once = true,
}) {
  const Tag = tag;

  if (animation === 'typing') {
    return <TypingText text={text} className={className} delay={delay} />;
  }

  if (animation === 'words') {
    const words = text.split(' ');
    return (
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once }}
              transition={{
                delay: delay + i * staggerDelay,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && '\u00A0'}
          </span>
        ))}
      </Tag>
    );
  }

  if (animation === 'split') {
    const chars = text.split('');
    return (
      <Tag className={className}>
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: '110%', opacity: 0, rotateX: -90 }}
            whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
            viewport={{ once }}
            transition={{
              delay: delay + i * (staggerDelay * 0.5),
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </Tag>
    );
  }

  if (animation === 'blur') {
    return (
      <Tag className={className}>
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once }}
          transition={{
            delay,
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {text}
        </motion.span>
      </Tag>
    );
  }

  // Default: slide up
  return (
    <Tag className={className}>
      <div className="overflow-hidden">
        <motion.div
          initial={{ y: '110%' }}
          whileInView={{ y: 0 }}
          viewport={{ once }}
          transition={{
            delay,
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {text}
        </motion.div>
      </div>
    </Tag>
  );
}

/**
 * TypingText — Typewriter animation with blinking cursor
 */
function TypingText({ text, className, delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <span className={className}>
      {displayed}
      <span
        className="inline-block w-[2px] h-[1em] ml-1 align-middle"
        style={{
          background: showCursor ? 'var(--color-accent-violet)' : 'transparent',
          transition: 'background 0.1s',
        }}
      />
    </span>
  );
}
