import React from "react";

import InfoCard from "../components/Cards/InfoCard";
import { Card, CardBody } from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import { MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";
import SectionTitle from "../components/Typography/SectionTitle";
import CTA from "../components/CTA";
import { Button } from "@windmill/react-ui";
import { useGlobalContext } from "../context/GlobalContext";
import ThemedSuspense from "../components/ThemedSuspense";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function Dashboard() {
  const { articlesFromDB, articlesLoader, eventsFromDB, eventsLoader } =
    useGlobalContext();

  if (articlesLoader | eventsLoader) {
    return <ThemedSuspense />;
  }

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      <CTA />

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 ">
        <InfoCard title="Total Articles" value={articlesFromDB?.length}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Events" value={eventsFromDB?.length}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <SectionTitle>Your Dashboard</SectionTitle>

      <div className="">
        <Card>
          <CardBody>
            <p className="text-gray-600 dark:text-gray-400 ">
              Here is your comprehensive and well-organized dashboard, you'll
              find an extensive list of articles and events, each elegantly
              displayed with their corresponding project names, links, creation
              dates, and brief descriptions, allowing you to effortlessly
              manage, review, and keep track of all your ongoing and completed
              projects in one centralized location.
            </p>
            <div className="mt-6">
              <Button tag={Link} to="/app/articles">
                See Aticles
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Dashboard;
